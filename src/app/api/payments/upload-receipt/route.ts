export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = (formData.get('receipt') || formData.get('file')) as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No receipt file provided. Please choose an image or PDF.' },
        { status: 400 }
      );
    }

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WEBP, or PDF are allowed.' },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'pdf'].includes(ext) ? ext : 'jpg';
    const filename = `receipt-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}.${safeExt}`;

    let publicUrl: string;
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);

      publicUrl = `/uploads/receipts/${filename}`;
    } catch (fsErr) {
      // Serverless fallback (e.g. Vercel read-only filesystem)
      publicUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error: any) {
    console.error('Receipt upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload receipt file. Please try again.' },
      { status: 500 }
    );
  }
}
