import { PrismaClient } from "@prisma/client";
import { ExtendedPrismaClient } from "@/types/prisma-models";

const prismaClientSingleton = () => {
  return new PrismaClient() as unknown as ExtendedPrismaClient;
};

declare global {
  var prismaGlobal: undefined | ExtendedPrismaClient;
}

const prisma: ExtendedPrismaClient = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
