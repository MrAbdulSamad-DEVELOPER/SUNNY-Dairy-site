export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin, logActivity } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const cleanFileName = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${cleanFileName}`;

    await logActivity({
      action: 'UPLOAD_IMAGE',
      entityType: 'IMAGE',
      entityId: cleanFileName,
      details: `Uploaded image ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: cleanFileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error uploading file' },
      { status: 500 }
    );
  }
}
