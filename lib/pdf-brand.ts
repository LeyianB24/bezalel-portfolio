import fs from "fs";
import path from "path";

let cachedLogoBase64: string | null = null;

export function getSiteLogoBase64(): string {
  if (cachedLogoBase64) return cachedLogoBase64;

  try {
    const logoPath = path.join(process.cwd(), "public", "logos", "bezalel-logo-horizontal-dark.png");
    if (fs.existsSync(logoPath)) {
      const buffer = fs.readFileSync(logoPath);
      cachedLogoBase64 = `data:image/png;base64,${buffer.toString("base64")}`;
      return cachedLogoBase64;
    }
  } catch (error) {
    console.error("Failed to load site logo for PDF:", error);
  }

  return "";
}
