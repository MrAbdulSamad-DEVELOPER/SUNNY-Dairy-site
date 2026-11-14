export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { sendPasswordResetEmail, DEFAULT_SENDER_EMAIL } from '@/lib/email';
import { logActivity } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`forgot_pw_${clientIp}`, 6, 60000); // 6 per min max
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait 1 minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const identity = (body.identity || '').trim().toLowerCase();

    if (!identity) {
      return NextResponse.json({ error: 'Barah-e-karam apna registered admin email darj karein.' }, { status: 400 });
    }

    // Look up admin by either email or username
    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: identity },
          { username: identity },
        ],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Is email ya username se koi registered admin account nahi mila. Barah-e-karam durust email darj karein.' },
        { status: 404 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Yeh admin account filhal deactivated hai. Super Admin se rabta karein.' },
        { status: 403 }
      );
    }

    // Generate a secure 6-digit verification code and a cryptographically secure token
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const rawToken = crypto.randomBytes(32).toString('hex');
    const combinedToken = `${resetCode}-${rawToken}`;
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes validity

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        resetToken: combinedToken,
        resetTokenExpiry: expiry,
      },
    });

    // Determine base URL
    const host = req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const resetUrl = `${proto}://${host}/admin/reset-password?token=${combinedToken}&code=${resetCode}&email=${encodeURIComponent(admin.email)}`;

    const sendResult = await sendPasswordResetEmail({
      toEmail: admin.email,
      adminUsername: admin.username,
      resetCode,
      resetUrl,
    });

    await logActivity({
      action: 'FORGOT_PASSWORD_REQUEST',
      entityType: 'ADMIN_USER',
      entityId: admin.id,
      details: `Password reset requested for admin @${admin.username} (${admin.email})`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: clientIp,
    });

    return NextResponse.json({
      success: true,
      message: `Password reset link aapke registered email (${admin.email}) par bhej diya gaya hai.`,
      targetEmail: admin.email,
      resetUrl,
      simulated: sendResult.simulated,
      devCode: sendResult.simulated ? resetCode : undefined,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing request' }, { status: 500 });
  }
}
