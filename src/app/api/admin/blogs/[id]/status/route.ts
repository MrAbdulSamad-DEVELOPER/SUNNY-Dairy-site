export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    const body = await req.json();
    const { isPublished, isFeatured } = body;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (isPublished !== undefined) dataToUpdate.isPublished = Boolean(isPublished);
    if (isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(isFeatured);

    const updated = await prisma.blogPost.update({
      where: { id },
      data: dataToUpdate,
    });

    await logActivity({
      action: 'UPDATE_BLOG_STATUS',
      entityType: 'BLOG_POST',
      entityId: id,
      details: `Updated blog "${updated.title}" status (published: ${updated.isPublished}, featured: ${updated.isFeatured})`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true, blog: updated });
  } catch (error: any) {
    console.error('Error updating blog status:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
