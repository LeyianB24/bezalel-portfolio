import fs from 'fs';

const digitalProductPhotos = [
  {
    // Real MacBook with clean code editor / developer desk (No AI glowing sci-fi)
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/nextstack-real.jpg',
    desc: 'Real MacBook with clean coding workspace'
  },
  {
    // Real person using smartphone payment / mobile banking
    url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/mpesa-real.jpg',
    desc: 'Real mobile digital payment and checkout transaction'
  },
  {
    // Real modern UI design system / component library on dual monitors
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/bezaui-real.jpg',
    desc: 'Real web designer workstation crafting UI components'
  },
  {
    // Real senior engineering team technical consulting audit
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/tech-audit-real.jpg',
    desc: 'Real technology consulting and architecture review session'
  }
];

async function run() {
  for (const item of digitalProductPhotos) {
    try {
      const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(item.dest, buf);
      console.log(`✅ Downloaded: ${item.dest} (${buf.length} bytes)`);
    } catch (err) {
      console.error(`❌ Failed: ${item.dest}`, err.message);
    }
  }

  // Also replace the old AI .png files with these real photos so any legacy references get real photos!
  if (fs.existsSync('public/images/nextstack-real.jpg')) {
    fs.copyFileSync('public/images/nextstack-real.jpg', 'public/images/saas_kit.png');
    console.log('✅ Overwrote public/images/saas_kit.png with real photo');
  }
  if (fs.existsSync('public/images/mpesa-real.jpg')) {
    fs.copyFileSync('public/images/mpesa-real.jpg', 'public/images/web_system.png');
    console.log('✅ Overwrote public/images/web_system.png with real photo');
  }
  if (fs.existsSync('public/images/bezaui-real.jpg')) {
    fs.copyFileSync('public/images/bezaui-real.jpg', 'public/images/hero_banner.png');
    console.log('✅ Overwrote public/images/hero_banner.png with real photo');
  }
  if (fs.existsSync('public/images/tech-audit-real.jpg')) {
    fs.copyFileSync('public/images/tech-audit-real.jpg', 'public/images/mobile_app.png');
    console.log('✅ Overwrote public/images/mobile_app.png with real photo');
  }
}

run();
