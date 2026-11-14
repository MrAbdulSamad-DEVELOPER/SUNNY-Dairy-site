export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { logActivity } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`reset_pw_${clientIp}`, 8, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait 1 minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const token = (body.token || '').trim();
    const code = (body.code || '').trim();
    const newPassword = body.newPassword || '';

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
    }

    if (!token && !code) {
      return NextResponse.json({ error: 'Verification code or reset token is required' }, { status: 400 });
    }

    const now = new Date();

    // Look up admin by either full token or 6-digit code prefix
    const admin = await prisma.adminUser.findFirst({
      where: {
        resetTokenExpiry: {
          gt: now,
        },
        OR: [
          ...(token ? [{ resetToken: token }] : []),
          ...(code ? [
            { resetToken: { startsWith: `${code}-` } },
            { resetToken: code },
          ] : []),
        ],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code / reset link. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash the new password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    await logActivity({
      action: 'PASSWORD_RESET_SUCCESS',
      entityType: 'ADMIN_USER',
      entityId: admin.id,
      details: `Password was successfully reset for admin account @${admin.username}`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: clientIp,
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been updated successfully! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing password reset' }, { status: 500 });
  }
}
