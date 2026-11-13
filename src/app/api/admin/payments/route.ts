import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';

    const where: any = {};

    if (status !== 'ALL') {
      where.paymentStatus = status;
    }

    if (search.trim()) {
      where.OR = [
        { senderName: { contains: search.trim() } },
        { transactionReference: { contains: search.trim() } },
        {
          order: {
            OR: [
              { orderNumber: { contains: search.trim() } },
              { customerName: { contains: search.trim() } },
              { customerPhone: { contains: search.trim() } },
            ],
          },
        },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            customerWhatsapp: true,
            finalTotal: true,
            subtotal: true,
            orderStatus: true,
            paymentMethod: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const counts = {
      all: await prisma.payment.count(),
      submitted: await prisma.payment.count({ where: { paymentStatus: 'PAYMENT_SUBMITTED' } }),
      underVerification: await prisma.payment.count({ where: { paymentStatus: 'UNDER_VERIFICATION' } }),
      verified: await prisma.payment.count({ where: { paymentStatus: 'VERIFIED' } }),
      rejected: await prisma.payment.count({ where: { paymentStatus: 'REJECTED' } }),
    };

    return NextResponse.json({ success: true, payments, counts });
  } catch (error: any) {
    console.error('Error fetching admin payments:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payments' },
      { status: 500 }
    );
  }
}
