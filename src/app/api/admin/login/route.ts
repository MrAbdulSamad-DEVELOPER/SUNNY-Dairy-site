import { NextRequest, NextResponse } from 'next/server';
import { adminLoginSchema } from '@/lib/validations';
import { signToken, logActivity } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = adminLoginSchema.parse(body);

    const clientIp = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';

    // 1. Look up admin user in database
    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'This admin account has been deactivated. Please contact the administrator.' },
        { status: 403 }
      );
    }

    // 2. Check if account is locked due to excessive failed attempts
    if (admin.lockedUntil && new Date() < admin.lockedUntil) {
      const waitMinutes = Math.ceil(
        (admin.lockedUntil.getTime() - Date.now()) / (1000 * 60)
      );
      return NextResponse.json(
        {
          error: `Account is temporarily locked due to failed attempts. Please try again in ${waitMinutes} minute(s).`,
        },
        { status: 429 }
      );
    }

    // 3. Verify password hash using bcrypt
    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      const failedAttempts = admin.failedLoginAttempts + 1;
      let lockedUntil: Date | null = null;

      if (failedAttempts >= 5) {
        // Lock for 15 minutes
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockedUntil,
        },
      });

      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // 4. Success: Reset failed attempts, update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const token = signToken(admin.id, admin.username, admin.role);
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
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
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    await logActivity({
      action: 'LOGIN',
      entityType: 'ADMIN_USER',
      entityId: admin.id,
      details: 'Administrator logged into system',
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: clientIp,
    });

    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Please enter a valid username and password' }, { status: 400 });
    }
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
  }
}
