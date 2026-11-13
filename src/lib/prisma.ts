import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string | undefined {
  // If running in Vercel or AWS Lambda serverless environment
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    try {
      const tmpDbPath = path.join('/tmp', 'dev.db');

      if (!fs.existsSync(tmpDbPath)) {
        const candidateLocations = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
          path.join(__dirname, 'prisma', 'dev.db'),
          '/var/task/prisma/dev.db',
        ];

        for (const loc of candidateLocations) {
          if (fs.existsSync(loc)) {
            fs.copyFileSync(loc, tmpDbPath);
            break;
          }
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.warn('Vercel serverless SQLite init warning:', e);
    }
  }

  return process.env.DATABASE_URL;
}

const resolvedDbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: resolvedDbUrl ? { db: { url: resolvedDbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
