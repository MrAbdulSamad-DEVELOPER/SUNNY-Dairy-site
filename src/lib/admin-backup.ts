import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export interface BackupAdminRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const BACKUP_FILE_PATH = path.join(process.cwd(), 'prisma', 'admin_users_backup.json');

export function loadBackupAdmins(): BackupAdminRecord[] {
  try {
    if (!fs.existsSync(BACKUP_FILE_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(BACKUP_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Could not read admin_users_backup.json:', err);
    return [];
  }
}

export function saveBackupAdmin(admin: BackupAdminRecord): void {
  try {
    const dir = path.dirname(BACKUP_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const existing = loadBackupAdmins();
    const index = existing.findIndex(
      (a) => a.id === admin.id || a.username.toLowerCase() === admin.username.toLowerCase()
    );

    if (index >= 0) {
      existing[index] = { ...existing[index], ...admin, updatedAt: new Date().toISOString() };
    } else {
      existing.push(admin);
    }

    fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write admin_users_backup.json:', err);
  }
}

export function deleteBackupAdmin(id: string): void {
  try {
    const existing = loadBackupAdmins();
    const filtered = existing.filter((a) => a.id !== id);
    fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not delete from admin_users_backup.json:', err);
  }
}

export function findBackupAdmin(identifier: string): BackupAdminRecord | null {
  const admins = loadBackupAdmins();
  const clean = identifier.trim().toLowerCase();
  return (
    admins.find(
      (a) => a.username.toLowerCase() === clean || a.email.toLowerCase() === clean
    ) || null
  );
}

export function getBackupAdminById(id: string): BackupAdminRecord | null {
  const admins = loadBackupAdmins();
  return admins.find((a) => a.id === id) || null;
}

export async function healAdminInDb(admin: BackupAdminRecord): Promise<void> {
  try {
    await prisma.adminUser.upsert({
      where: { id: admin.id },
      update: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
        fullName: admin.fullName,
        avatarUrl: admin.avatarUrl,
        bio: admin.bio,
        isActive: admin.isActive,
      },
      create: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        passwordHash: admin.passwordHash,
        role: admin.role,
        fullName: admin.fullName,
        avatarUrl: admin.avatarUrl,
        bio: admin.bio,
        isActive: admin.isActive,
      },
    });
  } catch (err) {
    // Silent catch, this is a background self-heal
  }
}
