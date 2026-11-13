import { NextResponse } from 'next/server';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function POST() {
  const admin = await getCurrentAdmin();
  if (admin) {
    await logActivity({
      action: 'LOGOUT',
      entityType: 'ADMIN_USER',
      entityId: admin.id,
      details: 'Administrator logged out',
      adminId: admin.id,
      adminUsername: admin.username,
    });
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('sunny_admin_session');
  return response;
}
