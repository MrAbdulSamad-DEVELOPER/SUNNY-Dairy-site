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
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30'; // days
    const days = parseInt(range, 10) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const statusCounts: Record<string, number> = {};
    let totalRevenue = 0;
    let deliveredRevenue = 0;

    orders.forEach((ord) => {
      statusCounts[ord.orderStatus] = (statusCounts[ord.orderStatus] || 0) + 1;
      const amt = ord.finalTotal !== null ? ord.finalTotal : ord.subtotal;
      totalRevenue += amt;
      if (ord.orderStatus === 'DELIVERED') {
        deliveredRevenue += amt;
      }
    });

    // Top products in this range
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    orders.forEach((ord) => {
      ord.items.forEach((item) => {
        if (!productSales[item.productNameSnapshot]) {
          productSales[item.productNameSnapshot] = {
            name: item.productNameSnapshot,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productNameSnapshot].quantity += item.quantity;
        const price = item.confirmedPrice ?? item.unitPriceSnapshot ?? 0;
        productSales[item.productNameSnapshot].revenue += price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity);

    return NextResponse.json({
      success: true,
      totalOrders: orders.length,
      totalRevenue,
      deliveredRevenue,
      statusCounts,
      topProducts,
      orders: orders.map((o) => ({
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        area: o.area,
        status: o.orderStatus,
        total: o.finalTotal ?? o.subtotal,
        date: o.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
