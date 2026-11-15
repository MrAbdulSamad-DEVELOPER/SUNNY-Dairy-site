export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const totalCount = blogs.length;
    const publishedCount = blogs.filter((b) => b.isPublished).length;
    const draftCount = blogs.filter((b) => !b.isPublished).length;
    const featuredCount = blogs.filter((b) => b.isFeatured).length;

    return NextResponse.json({
      success: true,
      blogs,
      stats: {
        total: totalCount,
        published: publishedCount,
        draft: draftCount,
        featured: featuredCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
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

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Article title is required' }, { status: 400 });
    }
    if (!summary || !summary.trim()) {
      return NextResponse.json({ error: 'Article summary is required' }, { status: 400 });
    }
    if (!contentHtml || !contentHtml.trim()) {
      return NextResponse.json({ error: 'Article content is required' }, { status: 400 });
    }

    // Generate or clean slug
    let cleanSlug = slug
      ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Ensure unique slug
    let uniqueSlug = cleanSlug;
    let counter = 1;
    while (await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${cleanSlug}-${counter}`;
      counter++;
    }

    // Auto calculate read time if not provided
    const wordsCount = contentHtml.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const calculatedReadTime = readTime || `${Math.max(1, Math.ceil(wordsCount / 200))} min read`;

    const created = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: uniqueSlug,
        metaTitle: metaTitle?.trim() || `${title.trim()} | SUNNY Dairy`,
        metaDescription: metaDescription?.trim() || summary.trim().slice(0, 160),
        keywords: keywords?.trim() || null,
        summary: summary.trim(),
        coverImage: coverImage?.trim() || '/products/fresh-milk.jpg',
        imageAlt: imageAlt?.trim() || title.trim(),
        category: category?.trim() || 'Purity & Quality Guides',
        contentHtml: contentHtml.trim(),
        authorName: authorName?.trim() || 'Sanaullah',
        authorRole: authorRole?.trim() || 'Master Dairy Farm Manager',
        authorAvatar: authorAvatar?.trim() || '/profile.jpg',
        readTime: calculatedReadTime,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
        displayOrder: Number(displayOrder) || 0,
        faqsJson: faqsJson ? (typeof faqsJson === 'string' ? faqsJson : JSON.stringify(faqsJson)) : null,
        relatedProductSlug: relatedProductSlug?.trim() || null,
        relatedProductName: relatedProductName?.trim() || null,
      },
    });

    await logActivity({
      action: 'CREATE_BLOG_POST',
      entityType: 'BLOG_POST',
      entityId: created.id,
      details: `Created blog article "${created.title}" (slug: ${created.slug})`,
      adminId: admin.id,
      adminUsername: admin.username,
    });

    return NextResponse.json({ success: true, blog: created }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
