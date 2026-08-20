import { NextResponse } from "next/server";
import { auth } from "@/auth";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      const buffer = Buffer.from(await file.arrayBuffer());

      // 1. Process & optimize image with sharp (auto-rotate mobile photos, resize, compress to WebP)
      let processedBuffer: Buffer;
      let contentType = "image/webp";
      const isSvg = file.type === "image/svg+xml" || file.name.endsWith(".svg");

      if (isSvg) {
        processedBuffer = buffer;
        contentType = "image/svg+xml";
      } else {
        processedBuffer = await sharp(buffer)
          .rotate() // Auto-rotates based on EXIF (essential for phone uploads)
          .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();
      }

      // 2. Check if Vercel Blob is configured
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const { put } = await import("@vercel/blob");
          const ext = isSvg ? "svg" : "webp";
          const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}.${ext}`;
          const blob = await put(`portfolio/${safeName}`, processedBuffer, {
            access: "public",
            contentType,
          });
          uploadedUrls.push(blob.url);
          continue;
        } catch (blobErr) {
          console.warn("Vercel blob upload fallback:", blobErr);
        }
      }

      // 3. Check if Cloudinary is configured
      if (
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      ) {
        try {
          const base64Data = `data:${contentType};base64,${processedBuffer.toString("base64")}`;
          const timestamp = Math.round(new Date().getTime() / 1000);
          const crypto = await import("crypto");
          const signature = crypto
            .createHash("sha1")
            .update(`folder=bezalel_portfolio&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
            .digest("hex");

          const cFormData = new URLSearchParams();
          cFormData.append("file", base64Data);
          cFormData.append("api_key", process.env.CLOUDINARY_API_KEY);
          cFormData.append("timestamp", timestamp.toString());
          cFormData.append("signature", signature);
          cFormData.append("folder", "bezalel_portfolio");

          const cRes = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: cFormData,
            }
          );

          if (cRes.ok) {
            const cData = await cRes.json();
            if (cData.secure_url) {
              uploadedUrls.push(cData.secure_url);
              continue;
            }
          }
        } catch (cloudErr) {
          console.warn("Cloudinary upload fallback:", cloudErr);
        }
      }

      // 4. Resilient Base64 Data URI fallback (always succeeds on all devices, stored directly in database)
      const dataUri = `data:${contentType};base64,${processedBuffer.toString("base64")}`;
      uploadedUrls.push(dataUri);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }

    return NextResponse.json({
      url: uploadedUrls[0],
      urls: uploadedUrls,
      success: true,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
