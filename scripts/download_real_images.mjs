import fs from 'fs';
import path from 'path';

const downloads = [
  // 1. Store Products (Realistic hardware & accessories)
  {
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/unifi-switch-48-poe.jpg',
    desc: 'Ubiquiti 48-port PoE enterprise switch in server rack'
  },
  {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/cat6a-shielded-cable.jpg',
    desc: 'Cat6A RJ45 shielded high-speed Ethernet patch cables'
  },
  {
    url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/crestron-flex-conference.jpg',
    desc: 'Crestron Flex corporate conference AV video bar and touch controller'
  },
  {
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/hdmi-21-ultra-high-speed.jpg',
    desc: 'Braided HDMI 2.1 8K Ultra High-Speed gold-plated cable'
  },
  {
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/hikvision-32ch-nvr.jpg',
    desc: 'Hikvision 32-channel commercial NVR CCTV surveillance system'
  },
  {
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/pd-100w-gan-fast-charger.jpg',
    desc: '100W GaN 4-Port USB-C fast wall charger'
  },
  {
    url: 'https://images.unsplash.com/photo-1750711158632-5273ec9b9b86?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/mikrotik-cloud-router.jpg',
    desc: 'MikroTik Gigabit multi-WAN fiber core router'
  },
  {
    url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/smart-surge-pdu-extension.jpg',
    desc: '8-Way Heavy-Duty Surge Protector PDU power extension socket'
  },
  {
    url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/usb-c-multiport-hub.jpg',
    desc: '10-in-1 Aluminum USB-C multiport adapter & hub'
  },
  {
    url: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/products/wifi6-mesh-router-system.jpg',
    desc: 'Dual-band Wi-Fi 6 AX3000 Gigabit mesh router system'
  },

  // 2. Real Infrastructure & Engineering Photos (replacing AI illustrations)
  {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=85',
    dest: 'public/images/network_infrastructure.jpg',
    desc: 'High-density fiber optic server rack and switch infrastructure'
  },
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85',
    dest: 'public/images/web_system.jpg',
    desc: 'Real financial analytics and SACCO core banking dashboard'
  },
  {
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=85',
    dest: 'public/images/mobile_app.jpg',
    desc: 'Real smartphone device running responsive fintech application'
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85',
    dest: 'public/images/hero_banner.jpg',
    desc: 'Real technology engineering team deploying cloud systems'
  },
  {
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=85',
    dest: 'public/images/saas_kit.jpg',
    desc: 'Real developer workstation with multi-monitor cloud telemetry'
  },
];

fs.mkdirSync('public/images/products', { recursive: true });

async function downloadAll() {
  console.log(`Starting download of ${downloads.length} realistic photos...`);
  for (const item of downloads) {
    try {
      console.log(`Downloading: ${item.desc} -> ${item.dest}`);
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(item.dest, buffer);
      console.log(`  ✅ Done: ${buffer.length} bytes`);
    } catch (err) {
      console.error(`  ❌ Failed to download ${item.dest}:`, err.message);
    }
  }
  console.log('All real photos downloaded successfully!');
}

downloadAll();
