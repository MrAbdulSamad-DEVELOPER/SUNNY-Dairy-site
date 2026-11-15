export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin, signToken, logActivity } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { saveBackupAdmin } from '@/lib/admin-backup';

// GET: Fetch current admin profile
export async function GET(req: NextRequest) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: currentAdmin.id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        avatarUrl: user.avatarUrl || '/profile.jpg',
        fullName: user.fullName || (user.username === 'admin' ? 'Sanaullah' : user.username),
      },
    });
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// PUT: Update current admin profile (image, bio, full name, email, password)
export async function PUT(req: NextRequest) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, bio, avatarUrl, email, currentPassword, newPassword } = body;

    // Validate email if changed
    let updatedEmail = currentAdmin.email;
    if (email && email.trim() !== currentAdmin.email) {
      const emailTrimmed = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }

      // Check if another admin already uses this email
      const existing = await prisma.adminUser.findFirst({
        where: {
          email: emailTrimmed,
          id: { not: currentAdmin.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: `The email address "${emailTrimmed}" is already registered to another administrator.` },
          { status: 409 }
        );
      }

      updatedEmail = emailTrimmed;
    }

    // Handle password change if requested
    let passwordHashUpdate: string | undefined = undefined;
    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.trim().length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      // If current password provided, verify it (unless SUPER_ADMIN resetting themselves)
      if (currentPassword) {
        const fullAdmin = await prisma.adminUser.findUnique({
          where: { id: currentAdmin.id },
        });
        if (fullAdmin) {
          const isMatch = await bcrypt.compare(currentPassword.trim(), fullAdmin.passwordHash);
          if (!isMatch) {
            return NextResponse.json(
              { error: 'Current password does not match. Please verify and try again.' },
              { status: 400 }
            );
          }
        }
      }

      const salt = await bcrypt.genSalt(10);
      passwordHashUpdate = await bcrypt.hash(newPassword.trim(), salt);
    }

    const updateData: any = {
      fullName: typeof fullName === 'string' ? fullName.trim() : undefined,
      bio: typeof bio === 'string' ? bio.trim() : undefined,
      avatarUrl: typeof avatarUrl === 'string' ? avatarUrl.trim() : undefined,
      email: updatedEmail,
    };

    if (passwordHashUpdate) {
      updateData.passwordHash = passwordHashUpdate;
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: currentAdmin.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    // Synchronize to persistent backup JSON
    saveBackupAdmin({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      passwordHash: passwordHashUpdate || (await prisma.adminUser.findUnique({ where: { id: currentAdmin.id } }))?.passwordHash || '',
      role: updatedUser.role,
      fullName: updatedUser.fullName || undefined,
      avatarUrl: updatedUser.avatarUrl || undefined,
      bio: updatedUser.bio || undefined,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await logActivity({
      action: 'UPDATE_PROFILE',
      entityType: 'ADMIN_USER',
      entityId: updatedUser.id,
      details: `Admin @${updatedUser.username} updated their profile details${passwordHashUpdate ? ' (including password)' : ''}`,
      adminId: updatedUser.id,
      adminUsername: updatedUser.username,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Profile updated permanently on the first click!',
      user: {
        ...updatedUser,
        avatarUrl: updatedUser.avatarUrl || '/profile.jpg',
      },
    });

    // If email changed, re-issue the signed session token cookie so session stays valid
    if (updatedEmail !== currentAdmin.email) {
      const newToken = signToken(updatedUser.id, updatedUser.username, updatedUser.role, updatedUser.email);
      response.cookies.set('sunny_admin_session', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: error.message || 'Server error updating profile' }, { status: 500 });
  }
}
