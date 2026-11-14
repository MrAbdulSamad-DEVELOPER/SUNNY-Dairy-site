export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

export { PUT } from '../admin/settings/route';
