import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { BLOG_POSTS } from '@/data/blogPosts';
import { CITIES_DATA } from '@/data/locations';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sunny-dairy-web.vercel.app';

  const staticPages = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/shop', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/blog', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/locations', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/wholesale-dairy-supplier', priority: 0.85, changeFrequency: 'weekly' as const },
    { route: '/pure-milk-vs-packaged-milk', priority: 0.85, changeFrequency: 'monthly' as const },
    { route: '/health-benefits-of-pure-desi-ghee', priority: 0.85, changeFrequency: 'monthly' as const },
    { route: '/about', priority: 0.85, changeFrequency: 'weekly' as const },
    { route: '/our-promise', priority: 0.85, changeFrequency: 'weekly' as const },
    { route: '/delivery', priority: 0.85, changeFrequency: 'weekly' as const },
    { route: '/track', priority: 0.7, changeFrequency: 'always' as const },
    { route: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/faq', priority: 0.75, changeFrequency: 'monthly' as const },
    { route: '/privacy', priority: 0.4, changeFrequency: 'yearly' as const },
    { route: '/terms', priority: 0.4, changeFrequency: 'yearly' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const locationPages = CITIES_DATA.map((city) => ({
    url: `${baseUrl}/locations/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const productPages = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [...staticPages, ...blogPages, ...locationPages, ...productPages];
  } catch (e) {
    return [...staticPages, ...blogPages, ...locationPages];
  }
}
