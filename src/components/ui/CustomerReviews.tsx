'use client';

import React from 'react';
import { Star, ShieldCheck, MapPin, Quote } from 'lucide-react';
import { VERIFIED_REVIEWS, AGGREGATE_REVIEW_STATS } from '@/data/reviews';

export default function CustomerReviews() {
  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SUNNY Dairy',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: AGGREGATE_REVIEW_STATS.ratingValue.toString(),
      reviewCount: AGGREGATE_REVIEW_STATS.reviewCount.toString(),
      bestRating: AGGREGATE_REVIEW_STATS.bestRating.toString(),
      worstRating: AGGREGATE_REVIEW_STATS.worstRating.toString(),
    },
    review: VERIFIED_REVIEWS.map((r) => ({
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
              Verified Customer Experiences
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900 tracking-tight">
              Trusted by Families Across <br className="hidden sm:inline" />
              <span className="text-forest-700">Pakistan &amp; Oman</span>
            </h2>
            <p className="text-xs sm:text-sm text-forest-600 leading-relaxed">
              Authentic reviews from households in Dera Ismail Khan, Islamabad, Lahore, Karachi, and Muscat who rely on SUNNY Dairy for unadulterated farm purity.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white px-5 py-3 rounded-2xl border border-cream-200 shadow-sm self-start md:self-auto">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="border-l border-cream-200 pl-3">
              <span className="font-bold text-forest-900 text-sm block">
                {AGGREGATE_REVIEW_STATS.ratingValue} / 5.0
              </span>
              <span className="text-[11px] text-forest-600 block">
                {AGGREGATE_REVIEW_STATS.reviewCount}+ Verified Deliveries
              </span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERIFIED_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-sm flex flex-col justify-between space-y-4 relative hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 space-x-0.5">
                    {Array.from({ length: rev.rating }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-forest-600 font-mono bg-cream-100 px-2 py-0.5 rounded-full">
                    {rev.productName}
                  </span>
                </div>

                <Quote className="w-6 h-6 text-gold-400/50" />

                <p className="text-xs sm:text-sm text-forest-800 leading-relaxed font-medium italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-cream-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-forest-900 text-xs sm:text-sm">{rev.authorName}</h4>
                  <div className="flex items-center space-x-1 text-[11px] text-forest-600 mt-0.5">
                    <MapPin className="w-3 h-3 text-gold-600 flex-shrink-0" />
                    <span>{rev.city}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Order</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
