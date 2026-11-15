import prisma from '@/lib/prisma';
import { BLOG_POSTS, BlogPost } from '@/data/blogPosts';

export async function getAllPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { publishedDate: 'desc' },
      ],
    });

    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map(transformDbPostToBlogPost);
    }
  } catch (error) {
    console.warn('Fallback to static BLOG_POSTS due to db query error:', error);
  }

  return BLOG_POSTS;
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (dbPost && dbPost.isPublished) {
      return transformDbPostToBlogPost(dbPost);
    }
  } catch (error) {
    console.warn(`Fallback to static BLOG_POSTS for slug "${slug}":`, error);
  }

  const staticPost = BLOG_POSTS.find((p) => p.slug === slug);
  return staticPost || null;
}

export async function getHomepageFeaturedBlogs(limit = 3): Promise<BlogPost[]> {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { publishedDate: 'desc' },
      ],
      take: limit,
    });

    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map(transformDbPostToBlogPost);
    }
  } catch (error) {
    console.warn('Fallback to static BLOG_POSTS for homepage:', error);
  }

  return BLOG_POSTS.slice(0, limit);
}

function transformDbPostToBlogPost(p: any): BlogPost {
  let parsedKeywords: string[] = [];
  if (p.keywords) {
    parsedKeywords = p.keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
  }

  let parsedFaqs: { question: string; answer: string }[] = [];
  if (p.faqsJson) {
    try {
      parsedFaqs = JSON.parse(p.faqsJson);
    } catch {
      parsedFaqs = [];
    }
  }

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    metaTitle: p.metaTitle || `${p.title} | SUNNY Dairy`,
    metaDescription: p.metaDescription || p.summary,
    keywords: parsedKeywords,
    summary: p.summary,
    coverImage: p.coverImage,
    imageAlt: p.imageAlt || p.title,
    publishedDate: p.publishedDate ? new Date(p.publishedDate).toISOString().split('T')[0] : '2026-11-10',
    readTime: p.readTime || '6 min read',
    author: {
      name: p.authorName || 'Sanaullah',
      role: p.authorRole || 'Master Dairy Farm Manager',
      avatar: p.authorAvatar || '/profile.jpg',
    },
    category: p.category || 'Purity & Quality Guides',
    contentHtml: p.contentHtml,
    faqs: parsedFaqs,
    relatedProductSlug: p.relatedProductSlug || 'pure-clarified-butter-artisanal-ghee',
    relatedProductName: p.relatedProductName || 'Pure Clarified Butter (Artisanal Ghee)',
  };
}
