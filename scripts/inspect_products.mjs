import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany();
  console.log('--- ALL PRODUCTS IN DATABASE ---');
  for (const p of prods) {
    console.log(`[${p.id}] ${p.name} (${p.slug}) => images: ${JSON.stringify(p.images)}`);
  }
}

main().finally(() => prisma.$disconnect());
