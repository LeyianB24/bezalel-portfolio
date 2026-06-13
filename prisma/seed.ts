import { PrismaClient } from '@prisma/client'
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
      images: [],
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
      images: [],
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
      images: [],
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
      images: [],
    },
    {
      name: 'AI SaaS Boilerplate',
      slug: 'ai-saas-boilerplate',
      description: 'Launch your AI-powered SaaS in days. Includes OpenAI/Anthropic integration, usage tracking, subscription billing with Stripe, user dashboards, and a prompt management system. Built with Next.js 14, TypeScript, and Prisma.',
      price: 6500,
      comparePrice: 10000,
      stock: 999,
      sku: 'BZL-AI-001',
      categoryId: createdCategories['saas-starter-kits'],
      images: [],
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        price: product.price,
        stock: product.stock,
        description: product.description,
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
      description: 'We are looking for a Senior Full-Stack Engineer to join our core product team. You will architect and build scalable web applications using Next.js, TypeScript, and PostgreSQL — shipping features that impact thousands of users.\n\nYou will work closely with our design and product teams to deliver exceptional user experiences while maintaining high engineering standards.',
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
      title: 'React Native Mobile Developer',
      department: 'Mobile',
      location: 'Remote (Africa)',
      type: 'FULL_TIME' as const,
      description: 'Join our mobile engineering team to build high-performance React Native applications for our enterprise clients. You will own the mobile architecture, implement complex features, and work with native modules.\n\nThis is an opportunity to work on impactful products used by businesses across East Africa.',
      requirements: [
        '3+ years of React Native development',
        'Published apps on App Store and/or Google Play',
        'Experience with state management (Zustand, Redux)',
        'Familiarity with native iOS/Android development',
        'Strong debugging and performance optimization skills',
        'Experience with CI/CD pipelines for mobile',
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
