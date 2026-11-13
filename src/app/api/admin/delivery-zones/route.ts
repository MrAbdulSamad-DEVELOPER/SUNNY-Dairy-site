import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({
      orderBy: { areaName: 'asc' },
    });
    return NextResponse.json({ success: true, zones });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve delivery zones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { areaName, city, deliveryFee, minOrderAmount, freeDeliveryThreshold, estimatedMinutes, isActive } = body;

    if (!areaName) {
      return NextResponse.json({ error: 'Area name is required' }, { status: 400 });
    }

    const created = await prisma.deliveryZone.create({
      data: {
        areaName,
        city: city || 'Dera Ismail Khan',
        deliveryFee: parseFloat(deliveryFee) || 150,
        minOrderAmount: parseFloat(minOrderAmount) || 500,
        freeDeliveryThreshold: freeDeliveryThreshold ? parseFloat(freeDeliveryThreshold) : null,
        estimatedMinutes: parseInt(estimatedMinutes, 10) || 60,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    await logActivity({
      action: 'CREATE_DELIVERY_ZONE',
      entityType: 'DELIVERY_ZONE',
      entityId: created.id,
      details: `Created delivery zone ${created.areaName} with fee Rs. ${created.deliveryFee}`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true, zone: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, areaName, city, deliveryFee, minOrderAmount, freeDeliveryThreshold, estimatedMinutes, isActive } = body;

    const updated = await prisma.deliveryZone.update({
      where: { id },
      data: {
        areaName,
        city,
        deliveryFee: parseFloat(deliveryFee),
        minOrderAmount: parseFloat(minOrderAmount),
        freeDeliveryThreshold: freeDeliveryThreshold ? parseFloat(freeDeliveryThreshold) : null,
        estimatedMinutes: parseInt(estimatedMinutes, 10),
        isActive,
      },
    });

    await logActivity({
      action: 'UPDATE_DELIVERY_ZONE',
      entityType: 'DELIVERY_ZONE',
      entityId: id,
      details: `Updated delivery zone ${updated.areaName}`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true, zone: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing zone ID' }, { status: 400 });

    await prisma.deliveryZone.delete({ where: { id } });

    await logActivity({
      action: 'DELETE_DELIVERY_ZONE',
      entityType: 'DELIVERY_ZONE',
      entityId: id,
      details: `Deleted delivery zone ID ${id}`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
