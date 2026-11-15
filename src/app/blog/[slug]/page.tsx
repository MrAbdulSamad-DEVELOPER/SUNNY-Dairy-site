import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getBlogBySlug, getAllPublishedBlogs } from '@/lib/blogs';
import { BlogPost } from '@/data/blogPosts';
import { getArticleSchema, getFaqSchema, getBreadcrumbSchema } from '@/lib/seo/schema';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { Clock, Calendar, ChevronRight, ArrowLeft, ArrowRight, Share2, HelpCircle, ShieldCheck } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPublishedBlogs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | SUNNY Dairy',
    };
  }

  const url = `https://sunny-dairy-web.vercel.app/blog/${post.slug}`;

  return {
    title: `${post.metaTitle} | SUNNY Dairy`,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: url,
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author.name],
      images: [
        {
          url: `https://sunny-dairy-web.vercel.app${post.coverImage}`,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: [`https://sunny-dairy-web.vercel.app${post.coverImage}`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = getArticleSchema(post);
  const faqSchema = getFaqSchema(post.faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const allPosts = await getAllPublishedBlogs();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const nextPost = allPosts.length > 1 && currentIndex !== -1 ? allPosts[(currentIndex + 1) % allPosts.length] : null;

  return (
    <article className="bg-cream-100 min-h-screen py-10 sm:py-16">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-forest-600">
          <Link href="/" className="hover:text-forest-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-forest-400" />
          <Link href="/blog" className="hover:text-forest-900 transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-forest-400" />
          <span className="text-forest-900 font-semibold truncate max-w-[200px] sm:max-w-none">
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gold-500/20 text-gold-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>{post.category}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-forest-600 border-b border-cream-200 pb-6">
            <div className="flex items-center space-x-2.5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border border-gold-400"
              />
              <div>
                <p className="font-bold text-forest-900">{post.author.name}</p>
                <p className="text-[11px] text-forest-600">{post.author.role}</p>
              </div>
            </div>
            <span className="hidden sm:inline text-cream-300">|</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-forest-500" />
              <span>Published {post.publishedDate}</span>
            </span>
            <span className="hidden sm:inline text-cream-300">|</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-forest-500" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-md bg-forest-900 aspect-video">
          <img
            src={post.coverImage}
            alt={post.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div
          className="prose prose-lg max-w-none prose-forest prose-headings:font-serif prose-headings:text-forest-900 prose-p:text-forest-800 prose-p:leading-relaxed prose-strong:text-forest-950 prose-li:text-forest-800"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Frequently Asked Questions Section */}
        {post.faqs.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm space-y-6 mt-12">
            <div className="flex items-center space-x-2 text-forest-900">
              <HelpCircle className="w-6 h-6 text-gold-600" />
              <h2 className="font-serif text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-cream-200">
              {post.faqs.map((faq, idx) => (
                <div key={idx} className="py-4 space-y-2 first:pt-0 last:pb-0">
                  <h3 className="font-bold text-base sm:text-lg text-forest-900">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-forest-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Next Article & Return to Blog */}
        <div className="pt-8 border-t border-cream-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-sm font-bold text-forest-800 hover:text-gold-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="inline-flex items-center space-x-2 text-sm font-bold text-gold-700 hover:text-gold-800 transition-colors text-right"
            >
              <span>Next: {nextPost.title.slice(0, 40)}...</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
