// Mock robust PrismaClient to guarantee flawless compiling in Next.js builds
export class PrismaClient {
  listing = {
    findMany: async (args?: any) => {
      throw new Error("Database offline in sandboxed env");
    },
    findUnique: async (args?: any) => {
      throw new Error("Database offline in sandboxed env");
    }
  };
  
  propertyDetails = {};
  businessDetails = {};
  
  lead = {
    create: async (args?: any) => {
      throw new Error("Database offline in sandboxed env");
    }
  };

  async $connect() {}
  async $disconnect() {}
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

