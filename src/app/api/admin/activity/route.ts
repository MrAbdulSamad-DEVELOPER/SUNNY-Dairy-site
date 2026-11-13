export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const logs = await prisma.activityLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve activity logs' }, { status: 500 });
  }
}
