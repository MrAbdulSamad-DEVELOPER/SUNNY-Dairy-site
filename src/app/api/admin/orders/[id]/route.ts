export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { orderStatusUpdateSchema } from '@/lib/validations';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve order' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = orderStatusUpdateSchema.parse(body);

    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If item confirmed prices were supplied in request, update order items
    if (validated.itemPrices) {
      for (const [itemId, price] of Object.entries(validated.itemPrices)) {
        if (price !== undefined) {
          await prisma.orderItem.update({
            where: { id: itemId },
            data: {
              confirmedPrice: price === null ? null : price,
            },
          });
        }
      }
    }

    // Refresh items to calculate updated total
    const currentItems = await prisma.orderItem.findMany({
      where: { orderId: params.id },
    });

    let newFinalTotal = 0;
    let anyUnconfirmed = false;

    for (const item of currentItems) {
      const price = item.confirmedPrice ?? item.unitPriceSnapshot;
      if (price !== null && price !== undefined) {
        newFinalTotal += price * item.quantity;
      } else {
        anyUnconfirmed = true;
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        orderStatus: validated.orderStatus,
        adminNotes: validated.adminNotes !== undefined ? validated.adminNotes : existingOrder.adminNotes,
        finalTotal: anyUnconfirmed ? null : newFinalTotal,
        priceConfirmationRequired: anyUnconfirmed,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export { PATCH as PUT };
