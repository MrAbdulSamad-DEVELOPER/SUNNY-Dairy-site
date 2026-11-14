export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { sendPasswordResetEmail, ADMIN_RECOVERY_EMAIL } from '@/lib/email';
import { logActivity } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`forgot_pw_${clientIp}`, 5, 60000); // 5 per min max
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait 1 minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const identity = (body.identity || '').trim().toLowerCase();

    if (!identity) {
      return NextResponse.json({ error: 'Please enter your username or email' }, { status: 400 });
    }

    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: identity },
          { email: identity },
        ],
      },
    });

    if (!admin) {
      // Return success anyway to avoid account enumeration
      return NextResponse.json({
        success: true,
        message: `If an account matches, instructions have been sent to ${ADMIN_RECOVERY_EMAIL}.`,
        targetEmail: ADMIN_RECOVERY_EMAIL,
      });
    }

    // Generate a secure 6-digit code and a cryptographically secure token
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const rawToken = crypto.randomBytes(24).toString('hex');
    const combinedToken = `${resetCode}-${rawToken}`;
    const expiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

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
    const resetUrl = `${proto}://${host}/admin/reset-password?token=${combinedToken}&code=${resetCode}`;

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
      details: `Password reset requested for @${admin.username}. Dispatched to recovery email ${ADMIN_RECOVERY_EMAIL}`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: clientIp,
    });

    return NextResponse.json({
      success: true,
      message: `Verification code and reset instructions sent to ${ADMIN_RECOVERY_EMAIL}.`,
      targetEmail: ADMIN_RECOVERY_EMAIL,
      simulated: sendResult.simulated,
      // Provide preview code in non-SMTP simulation mode so the administrator is never locked out
      devCode: sendResult.simulated ? resetCode : undefined,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing request' }, { status: 500 });
  }
}
