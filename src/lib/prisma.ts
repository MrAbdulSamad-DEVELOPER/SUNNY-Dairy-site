import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function ensureServerlessDatabase(): string | undefined {
  // Check if running in Vercel or AWS Lambda serverless environment
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.NETLIFY);

  if (isServerless) {
    try {
      const tmpDbPath = path.join('/tmp', 'dev.db');

      // Check if /tmp/dev.db exists and has a non-zero size
      let needsInit = true;
      if (fs.existsSync(tmpDbPath)) {
        try {
          const stats = fs.statSync(tmpDbPath);
          if (stats.size > 1000) {
            needsInit = false;
          }
        } catch {
          needsInit = true;
        }
      }

      if (needsInit) {
        let copied = false;
        const candidateLocations = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(process.cwd(), 'public', 'dev.db'),
          path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
          path.join(__dirname, 'prisma', 'dev.db'),
          '/var/task/prisma/dev.db',
        ];

        for (const loc of candidateLocations) {
          if (fs.existsSync(loc)) {
            try {
              fs.copyFileSync(loc, tmpDbPath);
              copied = true;
              break;
            } catch (err) {
              console.warn('Failed copying database from', loc, err);
            }
          }
        }

        // If not copied from disk, restore from embedded fallback
        if (!copied) {
          try {
            const seedModule = require('./db-seed-data');
            const rawB64 = seedModule.DB_BASE64 || seedModule.SEED_DB_BASE64;
            if (rawB64) {
              const buffer = Buffer.from(rawB64, 'base64');
              fs.writeFileSync(tmpDbPath, buffer);
              console.log('Restored SQLite dev.db from embedded fallback to /tmp/dev.db');
            }
          } catch (embedErr) {
            console.error('Failed to restore embedded SQLite database:', embedErr);
          }
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.warn('Serverless SQLite init exception:', e);
    }
  }

  return process.env.DATABASE_URL;
}

const resolvedDbUrl = ensureServerlessDatabase();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: resolvedDbUrl ? { db: { url: resolvedDbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

globalForPrisma.prisma = prisma;

export default prisma;
