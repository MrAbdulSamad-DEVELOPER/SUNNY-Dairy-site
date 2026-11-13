export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`track_${ip}`, 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many tracking attempts. Please wait a moment.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter a valid Order Number or Phone Number.' },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim();

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
        { error: `No orders found matching "${cleanQuery}".` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, orders, order: orders[0] });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`track_${ip}`, 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many tracking attempts. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const query = body.query;

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

    return NextResponse.json({ success: true, orders, order: orders[0] });
  } catch (error: any) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to look up order. Please try again.' },
      { status: 500 }
    );
  }
}
