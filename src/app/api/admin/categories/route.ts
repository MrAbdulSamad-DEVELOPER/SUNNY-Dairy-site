export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, slug, description } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const created = await prisma.category.create({
      data: { name, slug: cleanSlug, description },
    });

    await logActivity({
      action: 'CREATE_CATEGORY',
      entityType: 'CATEGORY',
      entityId: created.id,
      details: `Created category ${created.name}`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, name, slug, description } = await req.json();
    const updated = await prisma.category.update({
      where: { id },
      data: { name, slug, description },
    });

    await logActivity({
      action: 'UPDATE_CATEGORY',
      entityType: 'CATEGORY',
      entityId: id,
      details: `Updated category ${updated.name}`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await prisma.category.delete({ where: { id } });

    await logActivity({
      action: 'DELETE_CATEGORY',
      entityType: 'CATEGORY',
      entityId: id,
      details: `Deleted category ID ${id}`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
