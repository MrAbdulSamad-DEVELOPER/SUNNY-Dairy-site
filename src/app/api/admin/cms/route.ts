import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET() {
  try {
    const sections = await prisma.cmsSection.findMany();
    const map: Record<string, any> = {};
    sections.forEach((s) => {
      map[s.sectionKey] = s;
    });
    return NextResponse.json({ success: true, sections: map });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve CMS content' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { sectionKey, title, subtitle, content, imageUrl, buttonText, buttonLink, isEnabled, metadata } = body;

    if (!sectionKey) {
      return NextResponse.json({ error: 'sectionKey is required' }, { status: 400 });
    }

    const updated = await prisma.cmsSection.upsert({
      where: { sectionKey },
      update: {
        title,
        subtitle,
        content,
        imageUrl,
        buttonText,
        buttonLink,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        metadata: metadata !== undefined ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata)) : undefined,
      },
      create: {
        sectionKey,
        title,
        subtitle,
        content,
        imageUrl,
        buttonText,
        buttonLink,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        metadata: metadata !== undefined ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata)) : undefined,
      },
    });

    await logActivity({
      action: 'UPDATE_CMS_CONTENT',
      entityType: 'CMS_SECTION',
      entityId: sectionKey,
      details: `Updated homepage CMS section "${sectionKey}"`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (error: any) {
    console.error('Error updating CMS content:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
