import { cookies } from 'next/headers';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE_NAME = 'sunny_admin_session';
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || 'sunny-dairy-production-session-secret-key-32chars-min';

export function signToken(adminId: string, username: string, role: string): string {
  const timestamp = Date.now();
  const payload = `${adminId}:${username}:${role}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${hmac}`;
}

export function verifyToken(token: string): {
  valid: boolean;
  adminId?: string;
  username?: string;
  role?: string;
} {
  try {
    const [payloadBase64, hmac] = token.split('.');
    if (!payloadBase64 || !hmac) return { valid: false };

    const payload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');

    if (hmac !== expectedHmac) {
      return { valid: false };
    }

    const [adminId, username, role, timestampStr] = payload.split(':');
    const timestamp = parseInt(timestampStr, 10);

    // 7 days expiration
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > maxAge) {
      return { valid: false };
    }

    return { valid: true, adminId, username, role };
  } catch {
    return { valid: false };
  }
}

export async function getCurrentAdmin() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;

  const result = verifyToken(sessionCookie.value);
  if (!result.valid || !result.adminId) return null;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: result.adminId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const admin = await getCurrentAdmin();
  return admin !== null;
}

export async function logActivity({
  action,
  entityType,
  entityId,
  details,
  adminId,
  adminUsername,
  ipAddress,
}: {
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  adminId?: string;
  adminUsername: string;
  ipAddress?: string;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        details,
        adminId,
        adminUsername,
        ipAddress,
      },
    });
  } catch (e) {
    console.error('Failed to write activity log:', e);
  }
}
