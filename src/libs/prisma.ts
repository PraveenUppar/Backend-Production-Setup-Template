import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import config from '../config';

const adapter = new PrismaPg({ connectionString: config.database.url });

const prisma = new PrismaClient({
  adapter,
  log: config.isDevelopment ? ['query', 'error', 'warn'] : ['error', 'warn'],
});

export { prisma };
