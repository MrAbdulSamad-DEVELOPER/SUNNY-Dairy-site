export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET() {
  const current = await getCurrentAdmin();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ success: true, users, currentUser: current });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve admin users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const current = await getCurrentAdmin();
  if (!current || current.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Only Super Administrators can create staff accounts' }, { status: 403 });
  }

  try {
    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    // Check for existing user
    const existingUser = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: cleanEmail },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return NextResponse.json({ error: `Username "${cleanUsername}" is already taken.` }, { status: 400 });
      }
      return NextResponse.json({ error: `Email "${cleanEmail}" is already registered.` }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.adminUser.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        role: role || 'ADMIN',
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    await logActivity({
      action: 'CREATE_ADMIN_USER',
      entityType: 'ADMIN_USER',
      entityId: newUser.id,
      details: `Created new admin account for @${newUser.username} with role ${newUser.role}`,
      adminId: current.id,
      adminUsername: current.username,
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error creating staff account' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const current = await getCurrentAdmin();
  if (!current || current.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Only Super Administrators can delete accounts.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (id === current.id) {
      return NextResponse.json({ error: 'Cannot delete your own active account' }, { status: 400 });
    }

    const targetUser = await prisma.adminUser.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.adminUser.delete({ where: { id } });

    await logActivity({
      action: 'DELETE_ADMIN_USER',
      entityType: 'ADMIN_USER',
      entityId: id,
      details: `Deleted admin account @${targetUser.username}`,
      adminId: current.id,
      adminUsername: current.username,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error deleting account' }, { status: 500 });
  }
}
