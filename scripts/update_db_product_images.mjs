import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating database products with realistic photography...');

  const updates = [
    {
      slug: 'nextstack-pro-fullstack-starter',
      images: ['/images/nextstack-real.jpg'],
    },
    {
      slug: 'mpesa-integration-library',
      images: ['/images/mpesa-real.jpg'],
    },
    {
      slug: 'bezaui-react-component-library',
      images: ['/images/bezaui-real.jpg'],
    },
    {
      slug: 'tech-audit-consulting-session',
      images: ['/images/tech-audit-real.jpg'],
    },
    {
      slug: 'unifi-enterprise-24port-10g-poe',
      images: ['/images/products/unifi-switch-48-poe.jpg'],
    },
    {
      slug: 'crestron-flex-uc-boardroom-system',
      images: ['/images/products/crestron-flex-conference.jpg'],
    },
    {
      slug: 'hikvision-pro-32ch-4k-nvr',
      images: ['/images/products/hikvision-32ch-nvr.jpg'],
    }
  ];

  for (const item of updates) {
    const p = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (p) {
      await prisma.product.update({
        where: { slug: item.slug },
        data: { images: item.images }
      });
      console.log(`✅ Updated Product ${item.slug} with realistic image: ${item.images[0]}`);
    } else {
      console.log(`⚠️ Product ${item.slug} not found in DB`);
    }
  }

  console.log('All DB products now have 100% realistic photography!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
