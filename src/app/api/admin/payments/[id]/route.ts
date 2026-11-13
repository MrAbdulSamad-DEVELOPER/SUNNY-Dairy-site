export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { paymentStatus, adminNotes } = body;

    const validStatuses = [
      'AWAITING_PAYMENT',
      'PAYMENT_SUBMITTED',
      'UNDER_VERIFICATION',
      'VERIFIED',
      'REJECTED',
    ];

    if (!validStatuses.includes(paymentStatus)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const isVerificationAction = paymentStatus === 'VERIFIED' || paymentStatus === 'REJECTED';

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        paymentStatus,
        adminNotes: adminNotes !== undefined ? adminNotes : payment.adminNotes,
        verificationTimestamp: isVerificationAction ? new Date() : payment.verificationTimestamp,
        verifiedBy: isVerificationAction ? admin.username : payment.verifiedBy,
      },
      include: { order: true },
    });

    // Update parent order payment status
    if (paymentStatus === 'VERIFIED') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: 'PAID',
          // Automatically advance to CONFIRMED if previously PENDING
          ...(payment.order.orderStatus === 'PENDING'
            ? { orderStatus: 'CONFIRMED' }
            : {}),
        },
      });

      await logActivity({
        adminId: admin.id,
        adminUsername: admin.username,
        action: 'VERIFY_PAYMENT',
        entityType: 'PAYMENT',
        entityId: payment.id,
        details: `Verified UBL payment of Rs. ${payment.amount} for Order #${payment.order.orderNumber}. Ref: ${payment.transactionReference || 'N/A'}. Notes: ${adminNotes || 'None'}`,
      });
    } else if (paymentStatus === 'REJECTED') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: 'PENDING',
        },
      });

      await logActivity({
        adminId: admin.id,
        adminUsername: admin.username,
        action: 'REJECT_PAYMENT',
        entityType: 'PAYMENT',
        entityId: payment.id,
        details: `Rejected UBL payment of Rs. ${payment.amount} for Order #${payment.order.orderNumber}. Reason: ${adminNotes || 'Unspecified'}`,
      });
    } else {
      await logActivity({
        adminId: admin.id,
        adminUsername: admin.username,
        action: 'UPDATE_PAYMENT_STATUS',
        entityType: 'PAYMENT',
        entityId: payment.id,
        details: `Updated payment status to ${paymentStatus} for Order #${payment.order.orderNumber}`,
      });
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
    });
  } catch (error: any) {
    console.error('Payment update error:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}
