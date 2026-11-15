'use client';

import React from 'react';
import { Star, ShieldCheck, MapPin, Quote } from 'lucide-react';
import { VERIFIED_REVIEWS, AGGREGATE_REVIEW_STATS, CustomerReview } from '@/data/reviews';

interface CustomerReviewsProps {
  cmsData?: {
    isEnabled?: boolean;
    title?: string;
    subtitle?: string;
    content?: string;
    metadata?: string;
  };
}

export default function CustomerReviews({ cmsData }: CustomerReviewsProps) {
  if (cmsData?.isEnabled === false) {
    return null;
  }

  let reviewsList: CustomerReview[] = VERIFIED_REVIEWS;
  if (cmsData?.metadata) {
    try {
      const parsed = typeof cmsData.metadata === 'string' ? JSON.parse(cmsData.metadata) : cmsData.metadata;
      if (Array.isArray(parsed) && parsed.length > 0) {
        reviewsList = parsed;
      }
    } catch {}
  }

  const badgeText = cmsData?.subtitle || 'Verified Customer Experiences';
  const headingTitle = cmsData?.title || 'Trusted by Families Across Pakistan & Oman';
  const subContent =
    cmsData?.content ||
    'Authentic reviews from households in Dera Ismail Khan, Islamabad, Lahore, Karachi, and Muscat who rely on SUNNY Dairy for unadulterated farm purity.';

  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SUNNY Dairy',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: AGGREGATE_REVIEW_STATS.ratingValue.toString(),
      reviewCount: reviewsList.length.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: reviewsList.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.authorName,
      },
      datePublished: r.date,
      reviewBody: r.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    })),
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              {badgeText}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900 tracking-tight">
              {headingTitle}
            </h2>
            <p className="text-xs sm:text-sm text-forest-600 leading-relaxed">
              {subContent}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white px-5 py-3 rounded-2xl border border-cream-200 shadow-sm self-start md:self-auto">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-xs">
              <span className="font-bold text-forest-900">{AGGREGATE_REVIEW_STATS.ratingValue} / 5.0</span>
              <span className="text-forest-500 ml-1.5">({reviewsList.length}+ Verified Orders)</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.slice(0, 6).map((r) => (
            <div
              key={r.id || r.authorName}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-forest-400">{r.date}</span>
                </div>

                <p className="text-xs sm:text-[13px] text-forest-800 leading-relaxed italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-cream-200/60 flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-sm text-forest-900">
                    {r.authorName}
                  </div>
                  <div className="text-[11px] text-forest-500 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gold-600 flex-shrink-0" />
                    <span>{r.city}</span>
                  </div>
                </div>

                {r.verifiedPurchase !== false && (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Order</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
