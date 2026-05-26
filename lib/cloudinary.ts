import { Buffer } from "buffer";

/**
 * Uploads a file (PDF, DOC, image, etc.) to Cloudinary in a specified folder.
 * If credentials are not set, falls back to a simulated mock URL.
 */
export async function uploadFile(
  file: File | Buffer | Blob,
  filename: string,
  folder: string = "general"
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(`⚠️ Cloudinary credentials missing. Using mock upload for folder: ${folder}`);
    const sanitizedFilename = filename.replace(/\s+/g, "_");
    const mockUrl = `/mock-${folder}/${Date.now()}_${sanitizedFilename}`;
    console.log(`📂 [MOCK UPLOAD SUCCESS]: ${filename} -> ${mockUrl}`);
    return mockUrl;
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    
    // Cloudinary signature parameters must be sorted alphabetically
    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    const crypto = await import("crypto");
    const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

    const formData = new FormData();
    
    let fileBlob: Blob;
    if (file instanceof Blob || file instanceof File) {
      fileBlob = file;
    } else {
      fileBlob = new Blob([new Uint8Array(file)]);
    }

    formData.append("file", fileBlob, filename);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    // Auto resource type handles raw files like PDFs or Docx
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary response error: ${response.statusText} - ${errText}`);
    }

    const data = await response.json();
    return data.secure_url || data.url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    const sanitizedFilename = filename.replace(/\s+/g, "_");
    const fallbackUrl = `/mock-${folder}/${Date.now()}_${sanitizedFilename}`;
    console.warn(`⚠️ Cloudinary upload failed. Falling back to mock URL: ${fallbackUrl}`);
    return fallbackUrl;
  }
}

/**
 * Uploads a CV file (PDF or DOC) to Cloudinary.
 */
export async function uploadCV(
  file: File | Buffer | Blob,
  filename: string
): Promise<string> {
  return uploadFile(file, filename, "cvs");
}

