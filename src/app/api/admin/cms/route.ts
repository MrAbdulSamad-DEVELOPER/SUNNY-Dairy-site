export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sections = await prisma.cmsSection.findMany();
    const map: Record<string, any> = {};
    sections.forEach((s) => {
      map[s.sectionKey] = s;
    });
    return NextResponse.json(
      { success: true, sections: map },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
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

    // Support both single section and bulk sections payload
    const sectionsToUpsert: any[] = [];
    if (body.sections && typeof body.sections === 'object') {
      if (Array.isArray(body.sections)) {
        sectionsToUpsert.push(...body.sections);
      } else {
        for (const [key, val] of Object.entries(body.sections)) {
          sectionsToUpsert.push({ sectionKey: key, ...(val as object) });
        }
      }
    } else if (body.sectionKey) {
      sectionsToUpsert.push(body);
    }

    if (sectionsToUpsert.length === 0) {
      return NextResponse.json({ error: 'No sections provided to update' }, { status: 400 });
    }

    const results = [];
    for (const item of sectionsToUpsert) {
      const { sectionKey, title, subtitle, content, imageUrl, buttonText, buttonLink, isEnabled, metadata } = item;
      if (!sectionKey) continue;

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
      results.push(updated);
    }

    await logActivity({
      action: 'UPDATE_CMS_CONTENT',
      entityType: 'CMS_SECTION',
      details: `Updated ${results.length} homepage CMS section(s)`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json(
      { success: true, sections: results },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error updating CMS content:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
