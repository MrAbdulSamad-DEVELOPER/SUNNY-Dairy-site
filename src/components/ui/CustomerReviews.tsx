'use client';

import React from 'react';
import { Star, ShieldCheck, MapPin, Quote } from 'lucide-react';

export default function CustomerReviews() {
  const reviews = [
    {
      name: 'Dr. Tariq Mahmood',
      location: 'Officers Colony, D.I. Khan Cantt',
      role: 'Verified Family Customer',
      stars: 5,
      date: 'Ordered 40+ times',
      comment:
        'Finding pure whole milk with thick natural cream in Dera Ismail Khan is a true blessing. Our children love the fresh taste, and morning delivery is always punctual.',
    },
    {
      name: 'Haji Muhammad Aslam',
      location: 'Circular Road, D.I. Khan',
      role: 'Regular Buyer',
      stars: 5,
      date: 'Monthly Subscriber',
      comment:
        'Their pure desi ghee and artisanal butter have that authentic village aroma and granular golden texture. Food cooked with it smells incredible, with zero chemicals or additives.',
    },
    {
      name: 'Malik Zeeshan Awan',
      location: 'Commissionery Bazaar Area',
      role: 'Sweet & Milk Customer',
      stars: 5,
      date: 'Weekly Order',
      comment:
        'The traditional sweets and fresh milk are outstanding in quality. Sanaullah personally oversees production, making their service far superior to commercial brands.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              Honest Feedback
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900 tracking-tight">
              Loved by families across <br className="hidden sm:inline" />
              <span className="text-forest-700">Dera Ismail Khan</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Real reviews from households who trust SUNNY Dairy every morning for pure farm nutrition.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-2xl border border-borderCream shadow-xs self-start md:self-auto">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="border-l border-borderCream pl-3">
              <span className="font-bold text-forest-900 text-sm block">4.9 / 5.0</span>
              <span className="text-[10px] text-muted block">500+ Local Customers</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-7 border border-borderCream shadow-sm flex flex-col justify-between space-y-4 relative hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 space-x-0.5">
                    {Array.from({ length: rev.stars }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted font-mono">{rev.date}</span>
                </div>

                <Quote className="w-7 h-7 text-gold-300/40" />

                <p className="text-xs sm:text-sm text-forest-800 leading-relaxed font-medium italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-borderCream/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-forest-900 text-xs sm:text-sm">{rev.name}</h4>
                  <div className="flex items-center space-x-1 text-[11px] text-muted mt-0.5">
                    <MapPin className="w-3 h-3 text-gold-600 flex-shrink-0" />
                    <span>{rev.location}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
