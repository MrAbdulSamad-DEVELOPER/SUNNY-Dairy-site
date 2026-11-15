export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    const blog = await prisma.blogPost.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    const body = await req.json();

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const {
      title,
      slug,
      metaTitle,
      metaDescription,
      keywords,
      summary,
      coverImage,
      imageAlt,
      category,
      contentHtml,
      authorName,
      authorRole,
      authorAvatar,
      readTime,
      isPublished,
      isFeatured,
      displayOrder,
      faqsJson,
      relatedProductSlug,
      relatedProductName,
    } = body;

    // Check slug uniqueness if changed
    let cleanSlug = existing.slug;
    if (slug && slug.trim() !== existing.slug) {
      cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const slugClash = await prisma.blogPost.findFirst({
        where: { slug: cleanSlug, NOT: { id } },
      });
      if (slugClash) {
        return NextResponse.json({ error: `Slug "${cleanSlug}" is already in use by another article` }, { status: 400 });
      }
    }

    // Auto recalculate read time if content changed and readTime not manually altered
    let finalReadTime = readTime || existing.readTime;
    if (contentHtml && !readTime) {
      const wordsCount = contentHtml.replace(/<[^>]*>/g, '').split(/\s+/).length;
      finalReadTime = `${Math.max(1, Math.ceil(wordsCount / 200))} min read`;
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        slug: cleanSlug,
        metaTitle: metaTitle !== undefined ? metaTitle.trim() : existing.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription.trim() : existing.metaDescription,
        keywords: keywords !== undefined ? keywords.trim() : existing.keywords,
        summary: summary !== undefined ? summary.trim() : existing.summary,
        coverImage: coverImage !== undefined ? coverImage.trim() : existing.coverImage,
        imageAlt: imageAlt !== undefined ? imageAlt.trim() : existing.imageAlt,
        category: category !== undefined ? category.trim() : existing.category,
        contentHtml: contentHtml !== undefined ? contentHtml.trim() : existing.contentHtml,
        authorName: authorName !== undefined ? authorName.trim() : existing.authorName,
        authorRole: authorRole !== undefined ? authorRole.trim() : existing.authorRole,
        authorAvatar: authorAvatar !== undefined ? authorAvatar.trim() : existing.authorAvatar,
        readTime: finalReadTime,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
        faqsJson: faqsJson !== undefined ? (typeof faqsJson === 'string' ? faqsJson : JSON.stringify(faqsJson)) : existing.faqsJson,
        relatedProductSlug: relatedProductSlug !== undefined ? relatedProductSlug.trim() : existing.relatedProductSlug,
        relatedProductName: relatedProductName !== undefined ? relatedProductName.trim() : existing.relatedProductName,
      },
    });

    await logActivity({
      action: 'UPDATE_BLOG_POST',
      entityType: 'BLOG_POST',
      entityId: updated.id,
      details: `Updated blog article "${updated.title}" (slug: ${updated.slug})`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true, blog: updated });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id } });

    await logActivity({
      action: 'DELETE_BLOG_POST',
      entityType: 'BLOG_POST',
      entityId: id,
      details: `Deleted blog article "${existing.title}"`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
