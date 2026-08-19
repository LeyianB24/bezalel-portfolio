import { PrismaClient, EquipmentCategory, TechCategory } from '@prisma/client'
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
    },
    create: {
      email,
      name: 'Bezalel Admin',
      role: 'ADMIN',
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
      images: ['/images/saas_kit.png'],
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
      images: ['/images/web_system.png'],
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
      images: ['/images/hero_banner.png'],
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
      images: ['/images/mobile_app.png'],
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
      location: 'Nairobi, Kenya (Hybrid)',
      type: 'FULL_TIME' as const,
      description: 'We are looking for a Senior Full-Stack Engineer to join our core product team. You will architect and build scalable web applications using Next.js, TypeScript, and PostgreSQL — shipping features that impact thousands of users.',
      requirements: [
        '5+ years of experience in full-stack web development',
        'Expert-level TypeScript and React/Next.js',
        'Strong PostgreSQL and database design skills',
        'Experience with cloud infrastructure (AWS/GCP/Vercel)',
        'Excellent written and verbal communication skills',
        'Portfolio of shipped production applications',
      ],
      isOpen: true,
    },
    {
      title: 'IT Infrastructure & Network Technician',
      department: 'Infrastructure',
      location: 'Nairobi, Kenya (On-site)',
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
      name: 'BezaShop Commerce Platform',
      clientName: 'BezaShop Retail',
      description: 'Inventory synchronization, multi-channel payment reconciliation, and automated invoice dispatch with sub-80ms response times.',
      techTags: ['Next.js', 'PostgreSQL', 'M-Pesa Daraja', 'Stripe', 'Tailwind CSS'],
      liveUrl: 'https://bezalel.website',
      images: ['/images/web_system.png'],
      featured: true,
      displayOrder: 1,
    },
    {
      name: 'NexoLogistics Field Ops Suite',
      clientName: 'Nexo Freight EA',
      description: 'Offline-capable mobile dispatch and driver manifests with instant synchronization upon network reconnection.',
      techTags: ['React Native', 'TypeScript', 'Offline SQLite', 'Node.js', 'AWS'],
      liveUrl: 'https://bezalel.website',
      images: ['/images/mobile_app.png'],
      featured: true,
      displayOrder: 2,
    },
    {
      name: 'DataBridge Multi-Rail Gateway',
      clientName: 'Apex Financial Systems',
      description: 'Unified payments middleware handling automated STK push retries, webhook signature verifications, and bank integrations.',
      techTags: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'M-Pesa API'],
      liveUrl: 'https://bezalel.website',
      images: ['/images/hero_banner.png'],
      featured: true,
      displayOrder: 3,
    },
  ]

  for (const item of portfolioItems) {
    const existing = await prisma.portfolioItem.findFirst({ where: { name: item.name } })
    if (!existing) {
      await prisma.portfolioItem.create({ data: item })
      console.log(`✅ PortfolioItem seeded: ${item.name}`)
    } else {
      console.log(`⏭️  PortfolioItem already exists: ${item.name}`)
    }
  }

  // ── Equipment ────────────────────────────────────────────────
  const equipmentList = [
    {
      name: 'UniFi Enterprise 24-Port 10G PoE Managed Switch',
      category: EquipmentCategory.NETWORKING,
      description: 'High-density Layer 3 enterprise networking switch with 2.5GbE PoE+ ports and 10G SFP+ uplinks for mission-critical institutional LAN.',
      specs: ['24x 2.5GbE PoE+ RJ45 Ports', '2x 10G SFP+ Uplinks', '400W Total PoE Power Budget', 'Layer 3 Switching & VLAN Routing'],
      imageUrl: '/BG_images/codes people.jpg',
      isClientFacing: true,
      isSellable: true,
      status: 'ACTIVE',
      displayOrder: 1,
    },
    {
      name: 'Crestron Flex UC Boardroom Video System',
      category: EquipmentCategory.AV_CONFERENCING,
      description: 'Native Zoom Rooms and Microsoft Teams boardroom collaboration system with beamforming microphone array and intelligent 4K auto-framing camera.',
      specs: ['Native Zoom/Teams Touch Controller', '4K Ultra-HD Intelligent Camera', 'Dual Display Support (4K HDR)', 'Acoustic Echo Cancellation'],
      imageUrl: '/BG_images/business-people-meeting-high-tech-it-office_236854-48620.avif',
      isClientFacing: true,
      isSellable: true,
      status: 'ACTIVE',
      displayOrder: 2,
    },
    {
      name: 'Hikvision Pro 32-Channel 4K AcuSense NVR',
      category: EquipmentCategory.SECURITY_CCTV,
      description: 'AI-powered surveillance recorder with real-time perimeter protection, facial recognition, vehicle classification, and RAID-1 failover.',
      specs: ['32 Channels up to 12MP Resolution', '4x SATA Interface (up to 40TB)', 'AcuSense AI Deep Learning Filter', 'H.265+ Compression Engine'],
      imageUrl: '/BG_images/data.avif',
      isClientFacing: true,
      isSellable: true,
      status: 'ACTIVE',
      displayOrder: 3,
    },
  ]

  for (const eq of equipmentList) {
    const existing = await prisma.equipment.findFirst({ where: { name: eq.name } })
    if (!existing) {
      await prisma.equipment.create({ data: eq })
      console.log(`✅ Equipment seeded: ${eq.name}`)
    } else {
      console.log(`⏭️  Equipment already exists: ${eq.name}`)
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
