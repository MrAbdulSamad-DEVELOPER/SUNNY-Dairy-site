export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
      include: {
        variants: true,
      },
    });

    const lowStockItems = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);

    return NextResponse.json({
      success: true,
      products,
      lowStockCount: lowStockItems.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve inventory' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, newStock, reason } = body;

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const previousStock = existing.stockQuantity;
    const changeAmount = newStock - previousStock;

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: parseInt(newStock, 10),
      },
    });

    await prisma.inventoryLog.create({
      data: {
        productId,
        changeAmount,
        previousStock,
        newStock: parseInt(newStock, 10),
        reason: reason || 'Manual stock adjustment',
        adminUsername: admin.username,
      },
    });

    await logActivity({
      action: 'STOCK_ADJUSTMENT',
      entityType: 'INVENTORY',
      entityId: productId,
      details: `Adjusted stock for ${updated.name} from ${previousStock} to ${newStock} (${reason})`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
