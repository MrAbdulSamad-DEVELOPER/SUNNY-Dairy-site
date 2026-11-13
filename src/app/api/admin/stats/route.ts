export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: {
        orderStatus: { in: ['PENDING', 'PRICE_CONFIRMATION_REQUIRED'] },
      },
    });
    const confirmedOrders = await prisma.order.count({
      where: {
        orderStatus: 'CONFIRMED',
      },
    });
    const deliveredOrders = await prisma.order.count({
      where: {
        orderStatus: 'DELIVERED',
      },
    });

    const confirmedSalesAggregate = await prisma.order.aggregate({
      where: {
        orderStatus: { in: ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] },
      },
      _sum: {
        subtotal: true,
        finalTotal: true,
      },
    });

    const totalSales =
      confirmedSalesAggregate._sum.finalTotal ||
      confirmedSalesAggregate._sum.subtotal ||
      0;

    const recentOrders = await prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });

    // Best-selling products based on quantity ordered
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productNameSnapshot'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalSales,
        recentOrders,
        bestSellers: orderItems.map((item) => ({
          name: item.productNameSnapshot,
          totalSold: item._sum.quantity || 0,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
}
