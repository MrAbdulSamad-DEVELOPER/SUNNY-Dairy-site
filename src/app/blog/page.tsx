import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getAllPublishedBlogs } from '@/lib/blogs';
import { Clock, Calendar, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Dairy Purity, Nutrition & Wellness Blog | SUNNY Dairy',
  description:
    'Expert guides on pure cow milk, unadulterated clarified butter (desi ghee), cold-chain hygiene, and traditional artisanal confectionery across Pakistan and Oman.',
  alternates: {
    canonical: 'https://sunny-dairy-web.vercel.app/blog',
  },
  openGraph: {
    title: 'SUNNY Dairy Purity & Nutrition Blog',
    description:
      'Learn how to test pure desi ghee, explore the health benefits of morning whole milk, and discover why cold-chain dairy protects your family.',
    url: 'https://sunny-dairy-web.vercel.app/blog',
  },
};

export default async function BlogIndexPage() {
  const allPosts = await getAllPublishedBlogs();
  const featuredPost = allPosts[0];
  const regularPosts = allPosts.slice(1);

  return (
    <div className="bg-cream-100 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-forest-900/10 text-forest-800 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5 text-gold-600" />
            <span>Farm Journal &amp; Nutrition Guides</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 tracking-tight">
            The Dairy Purity Journal
          </h1>
          <p className="text-forest-700 text-sm sm:text-base leading-relaxed">
            Evidence-based guides, kitchen purity tests, and pastoral dairy insights crafted by Master Dairy Farm Manager Sanaullah to empower families across Pakistan and Oman.
          </p>
        </div>

        {/* Featured Post Card */}
        {featuredPost && (
          <div className="bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px] bg-forest-900">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-gold-500 text-forest-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Featured Guide
                </div>
              </div>
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-xs text-forest-600">
                    <span className="bg-forest-50 text-forest-800 font-semibold px-2.5 py-1 rounded-md">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredPost.readTime}</span>
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 hover:text-gold-700 transition-colors leading-snug">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-forest-700 text-sm leading-relaxed line-clamp-3">
                    {featuredPost.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-gold-400"
                    />
                    <div>
                      <p className="text-xs font-bold text-forest-900">{featuredPost.author.name}</p>
                      <p className="text-[11px] text-forest-600">{featuredPost.author.role}</p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center space-x-1 text-sm font-bold text-gold-700 hover:text-gold-800 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {regularPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 bg-forest-900 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-forest-900 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center space-x-4 text-xs text-forest-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.publishedDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-900 group-hover:text-gold-700 transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-forest-700 text-sm leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-cream-200/60 mt-4">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-gold-400"
                  />
                  <span className="text-xs font-semibold text-forest-900">{post.author.name}</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-forest-900 group-hover:text-gold-700 transition-colors"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Purity Trust Banner */}
        <div className="bg-forest-900 text-cream-100 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-gold-400 mx-auto" />
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Pure Dairy Direct From Farm Gate to Your Table
          </h3>
          <p className="text-forest-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every batch of fresh cow milk, goat milk, churned farm butter, and slow-simmered clarified butter follows our strict Zero Water Dilution pledge with daily laboratory checks.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold rounded-2xl shadow-md transition-all"
            >
              Shop All Products
            </Link>
            <Link
              href="/locations"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all"
            >
              View Delivery Cities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
