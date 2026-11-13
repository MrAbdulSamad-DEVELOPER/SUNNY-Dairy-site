export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter a valid Order Number or Phone Number.' },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim();

    // Try matching orderNumber, trackingCode, or customerPhone
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { orderNumber: { equals: cleanQuery } },
          { trackingCode: { equals: cleanQuery } },
          { customerPhone: { contains: cleanQuery } },
          { customerWhatsapp: { contains: cleanQuery } },
        ],
      },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: `No orders found matching "${cleanQuery}". Please check your order reference or phone number.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to look up order. Please try again.' },
      { status: 500 }
    );
  }
}
