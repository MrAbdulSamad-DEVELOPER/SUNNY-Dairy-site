import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const customers = await prisma.customer.findMany({
      include: {
        _count: {
          select: { orders: true },
        },
        orders: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            deliveryAddress: true,
            city: true,
            area: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, customers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve customers' }, { status: 500 });
  }
}
