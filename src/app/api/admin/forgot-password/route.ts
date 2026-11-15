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
    const identity = (body.identity || body.email || body.emailOrUsername || '').trim().toLowerCase();

    if (!identity) {
      return NextResponse.json(
        { error: 'Please enter your registered administrator email address or username.' },
        { status: 400 }
      );
    }

    // Look up admin by registered email address OR username (smooth, zero-friction login)
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
        { error: `No registered administrator account found matching "${identity}". Please check and try again.` },
        { status: 404 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'This administrator account is currently deactivated. Please contact the Super Admin.' },
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

    await sendPasswordResetEmail({
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

    // High security: Never return the resetUrl or verification code in the client response
    return NextResponse.json({
      success: true,
      message: `A password reset link has been dispatched to your registered email (${admin.email}). Please check your email inbox and click the link to reset your password.`,
      targetEmail: admin.email,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing request' }, { status: 500 });
  }
}
