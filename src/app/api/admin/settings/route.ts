export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.settingKey] = s.settingValue;
    });

    return NextResponse.json(
      { success: true, settings: settingsMap },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        await prisma.siteSetting.upsert({
          where: { settingKey: key },
          update: { settingValue: String(value) },
          create: {
            settingKey: key,
            settingValue: String(value),
          },
        });
      }
    }

    try {
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath('/contact');
      revalidatePath('/delivery');
      revalidatePath('/track');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    await logActivity({
      action: 'UPDATE_STORE_SETTINGS',
      entityType: 'SITE_SETTINGS',
      details: `Updated ${Object.keys(body).length} store settings keys`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return NextResponse.json(
      { success: true, message: 'Settings saved successfully' },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
