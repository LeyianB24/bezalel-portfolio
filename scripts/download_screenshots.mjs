import fs from 'fs';

const screenshots = [
  {
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/screenshots/analytics-overview.jpg',
    desc: 'Executive analytics dashboard with revenue charts'
  },
  {
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/screenshots/financial-transactions.jpg',
    desc: 'Financial transactions ledger and reconciliation stream'
  },
  {
    url: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/screenshots/mobile-telemetry.jpg',
    desc: 'Field mobile app with GPS map and offline sync manifests'
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/images/screenshots/cloud-audit.jpg',
    desc: 'Security audit logs and real-time infrastructure alerts'
  }
];

fs.mkdirSync('public/images/screenshots', { recursive: true });

async function run() {
  for (const item of screenshots) {
    try {
      const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fs.writeFileSync(item.dest, Buffer.from(await res.arrayBuffer()));
      console.log(`✅ Saved ${item.dest}`);
    } catch (e) {
      console.error(`❌ Failed ${item.dest}:`, e.message);
    }
  }
}

run();
