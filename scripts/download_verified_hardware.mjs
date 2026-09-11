import fs from 'fs';

const hardwareMap = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Power_strip.JPG',
    dest: 'public/images/products/smart-surge-pdu-extension.jpg',
    desc: 'Real power strip extension socket'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/USB_wall_charger.JPG',
    dest: 'public/images/products/pd-100w-gan-fast-charger.jpg',
    desc: 'Real USB wall charger fast adapter'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/USB-C_Hubb_5_portar.jpg',
    dest: 'public/images/products/usb-c-multiport-hub.jpg',
    desc: 'Real USB-C multiport hub adapter'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Wi-fi_router.jpg',
    dest: 'public/images/products/wifi6-mesh-router-system.jpg',
    desc: 'Real dual-band Wi-Fi router'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/CCTV_dome_camera.jpg',
    dest: 'public/images/products/hikvision-32ch-nvr.jpg',
    desc: 'Real CCTV surveillance security camera system'
  }
];

async function run() {
  for (const item of hardwareMap) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'BezalelPortfolioBot/1.0 (contact@bezalel.website)'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(item.dest, buf);
      console.log(`✅ Saved ${item.desc} -> ${item.dest} (${buf.length} bytes)`);
    } catch (e) {
      console.error(`❌ Failed ${item.dest}:`, e.message);
    }
  }
}

run();
