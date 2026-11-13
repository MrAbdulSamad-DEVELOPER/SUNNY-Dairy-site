export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { adminSetupSchema } from '@/lib/validations';
import { signToken, logActivity } from '@/lib/auth';

export async function GET() {
  const count = await prisma.adminUser.count();
  return NextResponse.json({ setupAllowed: count === 0 });
}

export async function POST(req: NextRequest) {
  try {
    const adminCount = await prisma.adminUser.count();
    if (adminCount > 0) {
      return NextResponse.json(
        { error: 'Initial setup is disabled because an administrator already exists.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = adminSetupSchema.parse(body);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const newAdmin = await prisma.adminUser.create({
      data: {
        username: validated.username.toLowerCase().trim(),
        email: validated.email.toLowerCase().trim(),
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    const token = signToken(newAdmin.id, newAdmin.username, newAdmin.role);
    const response = NextResponse.json({
      success: true,
      message: 'Primary administrator account created successfully',
    });

    const isSecure =
      req.nextUrl.protocol === 'https:' ||
      (process.env.NODE_ENV === 'production' && !req.nextUrl.hostname.includes('localhost'));

    response.cookies.set({
      name: 'sunny_admin_session',
      value: token,
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    await logActivity({
      action: 'INITIAL_SETUP',
      entityType: 'ADMIN_USER',
      entityId: newAdmin.id,
      details: `First administrator ${newAdmin.username} configured`,
      adminId: newAdmin.id,
      adminUsername: newAdmin.username,
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to configure initial administrator' },
      { status: 500 }
    );
  }
}
