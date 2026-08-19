import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      const normalizedUrl = url.startsWith("http://") || url.startsWith("https://") 
        ? url 
        : `https://${url}`;
      parsedUrl = new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const domain = parsedUrl.hostname.replace(/^www\./, "");
    const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BezalelLogoBot/1.0; +https://bezalel.website)",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json({
          logoUrl: fallbackFavicon,
          source: "favicon_service",
          domain,
        });
      }

      const html = await response.text();

      // 1. Check for apple-touch-icon (often higher resolution)
      const appleTouchMatch = html.match(/<link[^>]+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["'][^>]+href=["']([^"']+)["']/i) ||
                             html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["']/i);
      if (appleTouchMatch && appleTouchMatch[1]) {
        const resolved = new URL(appleTouchMatch[1], parsedUrl.origin).toString();
        return NextResponse.json({
          logoUrl: resolved,
          source: "apple_touch_icon",
          domain,
        });
      }

      // 2. Check for standard rel="icon" or rel="shortcut icon"
      const iconMatch = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i) ||
                        html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i);
      if (iconMatch && iconMatch[1]) {
        const resolved = new URL(iconMatch[1], parsedUrl.origin).toString();
        return NextResponse.json({
          logoUrl: resolved,
          source: "html_icon",
          domain,
        });
      }

      // 3. Check for og:image if it might be an icon/logo
      const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (ogImageMatch && ogImageMatch[1]) {
        const resolved = new URL(ogImageMatch[1], parsedUrl.origin).toString();
        return NextResponse.json({
          logoUrl: resolved,
          source: "og_image",
          domain,
        });
      }

      // 4. Default fallback to high-res Google favicon
      return NextResponse.json({
        logoUrl: fallbackFavicon,
        source: "favicon_service",
        domain,
      });
    } catch {
      // Return service fallback on fetch timeout/CORS/error
      return NextResponse.json({
        logoUrl: fallbackFavicon,
        source: "favicon_service_fallback",
        domain,
      });
    }
  } catch (error) {
    console.error("POST /api/portfolio/fetch-logo error:", error);
    return NextResponse.json({ error: "Failed to fetch logo" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
