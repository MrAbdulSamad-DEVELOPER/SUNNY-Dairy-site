export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  const adminCount = await prisma.adminUser.count();

  return NextResponse.json({
    authenticated: admin !== null,
    admin: admin
      ? {
          username: admin.username,
          email: admin.email,
          role: admin.role,
        }
      : null,
    needsInitialSetup: adminCount === 0,
  });
}
