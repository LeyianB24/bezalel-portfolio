const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const publicDir = path.join(root, 'public');
  const appDir = path.join(root, 'app');
  const logosDir = path.join(publicDir, 'logos');

  const goldMarkSvgPath = path.join(logosDir, 'bezalel-mark-gold.svg');
  const svgBuffer = fs.readFileSync(goldMarkSvgPath);

  // 1. Copy or write modern icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgBuffer);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgBuffer);
  console.log('✅ icon.svg created');

  // 2. Generate Apple Touch Icon (180x180) on solid navy square (#050D17)
  const mark120 = await sharp(svgBuffer)
    .resize(120, 120)
    .toBuffer();

  const appleTouchIcon = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 5, g: 13, b: 23, alpha: 1 } // #050D17
    }
  })
    .composite([{ input: mark120, gravity: 'center' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);
  fs.writeFileSync(path.join(appDir, 'apple-touch-icon.png'), appleTouchIcon);
  console.log('✅ apple-touch-icon.png (180x180) created');

  // 3. Generate multi-size ICO (16x16, 32x32, 48x48)
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  // Construct standard Windows ICO format with embedded PNGs
  const images = [
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ];

  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + (count * dirEntrySize);

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4); // count

  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size in bytes
    entry.writeUInt32LE(offset, 12); // file offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...images.map(img => img.buffer)
  ]);

  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✅ multi-size favicon.ico created');

  // 4. Generate high-resolution og-image.png (1200x630)
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#0B2036" />
        <stop offset="100%" stop-color="#050D17" />
      </radialGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F3DFA0" />
        <stop offset="50%" stop-color="#C9A24B" />
        <stop offset="100%" stop-color="#8B6F2E" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />

    <!-- Ambient Grid & Borders -->
    <rect x="30" y="30" width="1140" height="570" rx="16" fill="none" stroke="#C9A24B" stroke-opacity="0.25" stroke-width="1.5" />
    <rect x="42" y="42" width="1116" height="546" rx="12" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" />

    <!-- Brand Header -->
    <g transform="translate(100, 140)">
      <!-- Mark -->
      <g transform="scale(0.85)">
        <path d="M42.05 115.53 A60 60 0 0 1 125.36 45.62" stroke="#F3DFA0" stroke-width="24" stroke-linecap="round"/>
        <path d="M125.36 45.62 A60 60 0 0 1 158.68 87.53" stroke="#F3DFA0" stroke-width="24" stroke-linecap="round"/>
        <path d="M159.67 93.73 A60 60 0 0 1 140.92 143.88" stroke="#E3C476" stroke-width="24" stroke-linecap="round"/>
        <path d="M136.11 147.92 A60 60 0 0 1 83.46 157.68" stroke="#C9A24B" stroke-width="24" stroke-linecap="round"/>
        <path d="M77.52 155.63 A60 60 0 0 1 42.05 115.53" stroke="#A9803A" stroke-width="24" stroke-linecap="round"/>
      </g>

      <!-- Wordmark -->
      <text x="210" y="100" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" fill="#FAF6EC" letter-spacing="2">BEZALEL</text>
      <text x="210" y="145" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="20" fill="#C9A24B" letter-spacing="4">TECHNOLOGIES</text>
    </g>

    <!-- Headline & Description -->
    <text x="100" y="380" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" fill="#FFFFFF">
      Global Software Engineering &amp; Digital Infrastructure
    </text>
    <text x="100" y="440" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="22" fill="#8FA0B3">
      Custom Software Architecture · Cloud Systems · Mobile Platforms · Enterprise Hardware
    </text>

    <!-- Footer Badges -->
    <g transform="translate(100, 520)">
      <rect x="0" y="0" width="160" height="36" rx="6" fill="#C9A24B" fill-opacity="0.15" stroke="#C9A24B" stroke-opacity="0.4" />
      <text x="80" y="23" text-anchor="middle" font-family="monospace" font-weight="700" font-size="13" fill="#E8CD84">BEZALEL.WEBSITE</text>

      <rect x="180" y="0" width="190" height="36" rx="6" fill="#FFFFFF" fill-opacity="0.05" stroke="#FFFFFF" stroke-opacity="0.1" />
      <text x="275" y="23" text-anchor="middle" font-family="monospace" font-weight="600" font-size="13" fill="#8FA0B3">NAIROBI · GLOBAL</text>
    </g>
  </svg>
  `;

  const ogImageBuffer = await sharp(Buffer.from(ogSvg)).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogImageBuffer);
  console.log('✅ og-image.png (1200x630) created');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
