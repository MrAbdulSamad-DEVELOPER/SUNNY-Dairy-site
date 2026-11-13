import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, reason } = await req.json();

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (order.orderStatus === 'DELIVERED') {
      return NextResponse.json(
        { error: 'This order has already been delivered and cannot be cancelled.' },
        { status: 400 }
      );
    }

    if (order.orderStatus === 'CANCELLED') {
      return NextResponse.json(
        { error: 'This order is already marked as cancelled.' },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { orderNumber },
      data: {
        cancellationRequested: true,
        cancellationReason: reason || 'Customer requested cancellation via tracking portal',
      },
    });

    await logActivity({
      adminUsername: 'customer',
      action: 'CANCEL_REQUEST',
      entityType: 'ORDER',
      entityId: order.id,
      details: `Customer requested cancellation for order #${orderNumber}. Reason: ${reason || 'Not specified'}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Cancellation request submitted successfully. Our dispatch team will process it.',
      order: updated,
    });
  } catch (error: any) {
    console.error('Cancellation request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit cancellation request.' },
      { status: 500 }
    );
  }
}
