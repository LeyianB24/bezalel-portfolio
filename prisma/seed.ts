import { PrismaClient, EquipmentCategory, TechCategory, AdminPermission } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be defined in the environment.')
  }

  // ── Admin User ──────────────────────────────────────────────
  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      role: 'ADMIN',
      permissions: [AdminPermission.FULL_ACCESS],
    },
    create: {
      email,
      name: 'Bezalel Admin',
      role: 'ADMIN',
      permissions: [AdminPermission.FULL_ACCESS],
      password: hashed,
    },
  })
  console.log(`✅ Admin seeded: ${email}`)

  // ── Categories ───────────────────────────────────────────────
  const categories = [
    { name: 'Software Templates', slug: 'software-templates' },
    { name: 'SaaS Starter Kits', slug: 'saas-starter-kits' },
    { name: 'UI Components', slug: 'ui-components' },
    { name: 'Consulting Packages', slug: 'consulting-packages' },
    { name: 'Hardware & Infrastructure', slug: 'hardware-infrastructure' },
  ]

  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    })
    createdCategories[cat.slug] = created.id
    console.log(`✅ Category seeded: ${cat.name}`)
  }

  // ── Products ─────────────────────────────────────────────────
  const products = [
    {
      name: 'NextStack Pro — Full-Stack Starter',
      slug: 'nextstack-pro-fullstack-starter',
      description: 'Production-ready Next.js 14 starter kit with Prisma, NextAuth, Stripe, Resend, Tailwind CSS, and a fully built admin dashboard. Deploy to Vercel in 5 minutes. Includes dark/light mode, SEO optimization, and comprehensive TypeScript types.',
      price: 4500,
      comparePrice: 7500,
      stock: 999,
      sku: 'BZL-TPL-001',
      categoryId: createdCategories['saas-starter-kits'],
      images: ['/images/nextstack-real.jpg'],
      isDigital: true,
    },
    {
      name: 'M-Pesa Integration Library',
      slug: 'mpesa-integration-library',
      description: 'Complete M-Pesa Daraja API Node.js integration package. Includes STK Push, B2C, C2B, account balance queries, and transaction status checks. Fully documented with TypeScript support and webhook handling built in.',
      price: 2800,
      comparePrice: 5000,
      stock: 999,
      sku: 'BZL-LIB-001',
      categoryId: createdCategories['software-templates'],
      images: ['/images/mpesa-real.jpg'],
      isDigital: true,
    },
    {
      name: 'BezaUI — React Component Library',
      slug: 'bezaui-react-component-library',
      description: 'Premium React + Tailwind CSS component library featuring 60+ production-ready components. Includes data tables, forms, modals, charts, notification systems, and advanced layouts — all with dark mode and accessibility support.',
      price: 3200,
      comparePrice: null,
      stock: 999,
      sku: 'BZL-UI-001',
      categoryId: createdCategories['ui-components'],
      images: ['/images/bezaui-real.jpg'],
      isDigital: true,
    },
    {
      name: 'Tech Audit — 1-Hour Consulting Session',
      slug: 'tech-audit-consulting-session',
      description: 'Book a 1-hour deep-dive technical audit with Bezalel senior engineers. We review your codebase, infrastructure, database design, API architecture, and security posture — then deliver a written report with actionable recommendations.',
      price: 8000,
      comparePrice: null,
      stock: 10,
      sku: 'BZL-CON-001',
      categoryId: createdCategories['consulting-packages'],
      images: ['/images/tech-audit-real.jpg'],
      isDigital: false,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        price: product.price,
        stock: product.stock,
        description: product.description,
        isDigital: product.isDigital,
        images: product.images,
      },
      create: product,
    })
    console.log(`✅ Product seeded: ${product.name}`)
  }

  // ── Jobs ─────────────────────────────────────────────────────
  const jobs = [
    {
      title: 'Senior Full-Stack Engineer',
      department: 'Engineering',
      location: 'Remote (Worldwide) / Nairobi Hybrid',
      type: 'FULL_TIME' as const,
      description: 'We are looking for a Senior Full-Stack Engineer to join our core product team. You will architect and build scalable web applications using Next.js, TypeScript, and PostgreSQL — shipping features that impact thousands of users globally.',
      requirements: [
        '5+ years of experience in full-stack web development',
        'Expert-level TypeScript and React/Next.js',
        'Strong PostgreSQL and database design skills',
        'Experience with cloud infrastructure (AWS/GCP/Vercel)',
        'Excellent written and verbal communication skills across distributed teams',
        'Portfolio of shipped production applications',
      ],
      isOpen: true,
    },
    {
      title: 'IT Infrastructure & Network Technician',
      department: 'Infrastructure',
      location: 'Nairobi, Kenya (On-site & Field Deployments)',
      type: 'FULL_TIME' as const,
      description: 'Install, configure, and maintain enterprise structured cabling, managed switches, boardroom AV, and CCTV systems.',
      requirements: [
        'Experience with Cisco/Ubiquiti/MikroTik networking equipment',
        'Familiarity with boardroom video conferencing hardware and surveillance networks',
        'Valid driver\'s license and field troubleshooting aptitude',
      ],
      isOpen: true,
    },
  ]

  for (const job of jobs) {
    const existing = await prisma.job.findFirst({ where: { title: job.title } })
    if (!existing) {
      await prisma.job.create({ data: job })
      console.log(`✅ Job seeded: ${job.title}`)
    } else {
      console.log(`⏭️  Job already exists: ${job.title}`)
    }
  }

  // ── Portfolio Items ──────────────────────────────────────────
  const portfolioItems = [
    {
      name: 'Harambee Financial Core SACCO System',
      clientName: 'Harambee SACCO Society',
      clientLogoUrl: '/logos/bezalel-mark-gold.svg',
      description: 'Distributed core ledger, multi-branch teller workstations, automated dividend processing, and real-time M-Pesa B2C/C2B loan disbursements handling KES 1.48M daily volume with 99.98% uptime.',
      techTags: ['Next.js', 'PostgreSQL', 'M-Pesa B2C/C2B', 'Redis', 'Docker'],
      liveUrl: 'https://bezalel.website',
      images: [
        '/images/web_system.jpg',
        '/images/screenshots/financial-transactions.jpg',
        '/images/screenshots/analytics-overview.jpg',
        '/BG_images/codes people.jpg',
      ],
      featured: true,
      displayOrder: 1,
    },
    {
      name: 'Osotua Dairy Co-op & Agribusiness ERP',
      clientName: 'Osotua Farming Co-operative',
      clientLogoUrl: '/logos/bezalel-mark-gold.svg',
      description: 'Farm-gate milk collection telemetry, automated weight integration via Bluetooth scales, offline field agent sync, and automated farmer payment batches for 1,420+ registered smallholders.',
      techTags: ['Next.js', 'React Native', 'PostgreSQL', 'Offline Sync', 'M-Pesa Bulk'],
      liveUrl: 'https://bezalel.website',
      images: [
        '/images/saas_kit.jpg',
        '/images/screenshots/analytics-overview.jpg',
        '/images/mobile_app.jpg',
        '/BG_images/AdobeStock_292953404-scaled.jpeg',
      ],
      featured: true,
      displayOrder: 2,
    },
    {
      name: 'Compass Cartage Cold-Chain & Fleet Engine',
      clientName: 'Compass Cartage Logistics',
      clientLogoUrl: '/logos/bezalel-mark-gold.svg',
      description: 'Cross-border corridor telemetry, GPS geofencing, IoT temperature sensors for perishable exports, and offline manifest compliance for 48 commercial refrigerated vehicles.',
      techTags: ['React Native', 'Node.js', 'PostgreSQL', 'IoT MQTT', 'AWS ECS'],
      liveUrl: 'https://bezalel.website',
      images: [
        '/images/mobile_app.jpg',
        '/images/screenshots/mobile-telemetry.jpg',
        '/images/network_infrastructure.jpg',
        '/BG_images/data.avif',
      ],
      featured: true,
      displayOrder: 3,
    },
    {
      name: 'BezaShop Multi-Currency Commerce Engine',
      clientName: 'BezaShop Retail & Exports',
      clientLogoUrl: '/logos/bezalel-mark-gold.svg',
      description: 'Inventory synchronization across 3 distribution hubs, multi-currency payment checkout (USD/EUR/KES), automated invoice dispatch, and sub-80ms page render speeds.',
      techTags: ['Next.js', 'Prisma', 'Stripe Multi-Currency', 'Daraja Rails', 'Tailwind CSS'],
      liveUrl: 'https://bezalel.website',
      images: [
        '/images/hero_banner.jpg',
        '/images/web_system.jpg',
        '/images/screenshots/financial-transactions.jpg',
        '/images/products/unifi-switch-48-poe.jpg',
      ],
      featured: true,
      displayOrder: 4,
    },
    {
      name: 'DataBridge Inter-Bank Settlement Gateway',
      clientName: 'Apex Financial Services',
      clientLogoUrl: '/logos/bezalel-mark-gold.svg',
      description: 'ISO-8583 and Daraja payments middleware processing automated inter-bank settlement, automated float balancing, cryptographic signature verification, and ledger reconciliations.',
      techTags: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'SWIFT API'],
      liveUrl: 'https://bezalel.website',
      images: [
        '/images/network_infrastructure.jpg',
        '/images/screenshots/cloud-audit.jpg',
        '/images/screenshots/financial-transactions.jpg',
        '/BG_images/codes people.jpg',
      ],
      featured: true,
      displayOrder: 5,
    },
    {
      name: 'Apex Industrial High-Availability Infrastructure',
      clientName: 'Apex Regional Headquarters',
      clientLogoUrl: '/logos/bezalel-mark-gold.svg',
      description: 'High-density Layer-3 10GbE network switching, redundant fiber failover with sub-second switchover, biometric access control, and boardroom Crestron telepresence integration.',
      techTags: ['10G Fiber SFP+', 'UniFi Enterprise', 'Crestron Flex', 'VLAN QoS', 'Linux'],
      liveUrl: 'https://bezalel.website',
      images: [
        '/images/products/unifi-switch-48-poe.jpg',
        '/images/products/crestron-flex-conference.jpg',
        '/images/products/hikvision-32ch-nvr.jpg',
        '/images/network_infrastructure.jpg',
      ],
      featured: true,
      displayOrder: 6,
    },
  ]

  for (const item of portfolioItems) {
    const existing = await prisma.portfolioItem.findFirst({ where: { name: item.name } })
    if (!existing) {
      await prisma.portfolioItem.create({ data: item })
      console.log(`✅ PortfolioItem seeded: ${item.name}`)
    } else {
      await prisma.portfolioItem.update({
        where: { id: existing.id },
        data: item,
      })
      console.log(`🔄 PortfolioItem updated: ${item.name}`)
    }
  }

  // ── Equipment & Hardware Packages with Pricing ──────────────
  const equipmentList = [
    {
      name: 'UniFi Enterprise 24-Port 10G PoE Managed Switch',
      category: EquipmentCategory.NETWORKING,
      description: 'High-density Layer 3 enterprise networking switch with 2.5GbE PoE+ ports and 10G SFP+ uplinks for mission-critical institutional LAN.',
      specs: ['24x 2.5GbE PoE+ RJ45 Ports', '2x 10G SFP+ Uplinks', '400W Total PoE Power Budget', 'Layer 3 Switching & VLAN Routing'],
      imageUrl: '/images/products/unifi-switch-48-poe.jpg',
      isClientFacing: true,
      isSellable: true,
      status: 'ACTIVE',
      displayOrder: 1,
      price: 85000,
      comparePrice: 95000,
      stock: 14,
      sku: 'BZL-NET-001',
    },
    {
      name: 'Crestron Flex UC Boardroom Video System',
      category: EquipmentCategory.AV_CONFERENCING,
      description: 'Native Zoom Rooms and Microsoft Teams boardroom collaboration system with beamforming microphone array and intelligent 4K auto-framing camera.',
      specs: ['Native Zoom/Teams Touch Controller', '4K Ultra-HD Intelligent Camera', 'Dual Display Support (4K HDR)', 'Acoustic Echo Cancellation'],
      imageUrl: '/images/products/crestron-flex-conference.jpg',
      isClientFacing: true,
      isSellable: true,
      status: 'ACTIVE',
      displayOrder: 2,
      price: 345000,
      comparePrice: 380000,
      stock: 6,
      sku: 'BZL-AV-001',
    },
    {
      name: 'Hikvision Pro 32-Channel 4K AcuSense NVR',
      category: EquipmentCategory.SECURITY_CCTV,
      description: 'AI-powered surveillance recorder with real-time perimeter protection, facial recognition, vehicle classification, and RAID-1 failover.',
      specs: ['32 Channels up to 12MP Resolution', '4x SATA Interface (up to 40TB)', 'AcuSense AI Deep Learning Filter', 'H.265+ Compression Engine'],
      imageUrl: '/images/products/hikvision-32ch-nvr.jpg',
      isClientFacing: true,
      isSellable: true,
      status: 'ACTIVE',
      displayOrder: 3,
      price: 52000,
      comparePrice: 58000,
      stock: 18,
      sku: 'BZL-SEC-001',
    },
  ]

  for (const eq of equipmentList) {
    const slug = eq.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    // Ensure corresponding Product exists with pricing
    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        price: eq.price,
        comparePrice: eq.comparePrice,
        stock: eq.stock,
        sku: eq.sku,
        description: eq.description,
        images: [eq.imageUrl],
      },
      create: {
        name: eq.name,
        slug,
        description: eq.description,
        price: eq.price,
        comparePrice: eq.comparePrice,
        stock: eq.stock,
        sku: eq.sku,
        categoryId: createdCategories['hardware-infrastructure'],
        images: [eq.imageUrl],
        isDigital: false,
      },
    })

    const existing = await prisma.equipment.findFirst({ where: { name: eq.name } })
    const eqData = {
      name: eq.name,
      category: eq.category,
      description: eq.description,
      specs: eq.specs,
      imageUrl: eq.imageUrl,
      isClientFacing: eq.isClientFacing,
      isSellable: eq.isSellable,
      status: eq.status,
      displayOrder: eq.displayOrder,
      productId: product.id,
    }

    if (!existing) {
      await prisma.equipment.create({
        data: eqData,
      })
      console.log(`✅ Equipment seeded with Product: ${eq.name} (KES ${eq.price.toLocaleString()})`)
    } else {
      await prisma.equipment.update({
        where: { id: existing.id },
        data: eqData,
      })
      console.log(`🔄 Equipment updated with Product: ${eq.name} (KES ${eq.price.toLocaleString()})`)
    }
  }

  // ── Tech Arsenal ─────────────────────────────────────────────
  const techItems = [
    { name: 'Next.js', category: TechCategory.CORE_SYSTEMS, iconKey: 'SiNextdotjs', isCore: true, displayOrder: 1 },
    { name: 'TypeScript', category: TechCategory.CORE_SYSTEMS, iconKey: 'SiTypescript', isCore: true, displayOrder: 2 },
    { name: 'PostgreSQL', category: TechCategory.PAYMENTS_DATABASE, iconKey: 'SiPostgresql', isCore: true, displayOrder: 3 },
    { name: 'M-Pesa Daraja', category: TechCategory.PAYMENTS_DATABASE, iconKey: 'CreditCard', isCore: true, displayOrder: 4 },
    { name: 'Docker', category: TechCategory.INFRA_CLOUD, iconKey: 'SiDocker', isCore: true, displayOrder: 5 },
    { name: 'AWS Cloud', category: TechCategory.INFRA_CLOUD, iconKey: 'FaAws', isCore: true, displayOrder: 6 },
    { name: 'React Native', category: TechCategory.MOBILE_DEVICES, iconKey: 'SiReact', isCore: true, displayOrder: 7 },
    { name: 'Cisco & Ubiquiti', category: TechCategory.HARDWARE_AV, iconKey: 'Network', isCore: true, displayOrder: 8 },
  ]

  for (const item of techItems) {
    const existing = await prisma.techArsenalItem.findFirst({ where: { name: item.name } })
    if (!existing) {
      await prisma.techArsenalItem.create({ data: item })
      console.log(`✅ TechItem seeded: ${item.name}`)
    }
  }

  console.log('\n🚀 Database seeded successfully!')
}

main()
  .catch((error) => {
    console.error('Error during seeding:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
