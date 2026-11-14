'use client';

import React, { useState } from 'react';
import { Calendar, Check, MessageSquare, ArrowRight, Milk, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

export default function DailySubscriptionBanner() {
  const [selectedPlan, setSelectedPlan] = useState<'1L' | '2L' | '5L'>('2L');

  const plans = [
    {
      id: '1L' as const,
      title: '1 Litre Daily',
      subtitle: 'Singles & Morning Tea Lovers',
      description: 'Pure morning cow milk in sealed sterilized packaging delivered daily before 8:30 AM.',
      tag: 'Starter Plan',
    },
    {
      id: '2L' as const,
      title: '2 Litres Daily',
      subtitle: 'Most Popular for Small Families',
      description: 'Ideal for breakfast, fresh homemade yogurt, and daily milk consumption for kids.',
      tag: 'Family Choice',
      featured: true,
    },
    {
      id: '5L' as const,
      title: '5 Litres Daily',
      subtitle: 'Complete Joint Family Nutrition',
      description: 'Daily fresh supply for larger households. Fresh churned butter and rich natural cream every day.',
      tag: 'Best Value',
    },
  ];

  const handleSubscribe = (planId: string) => {
    const text = `Hello! I would like to inquire about the SUNNY Dairy Daily Milk Subscription (${planId} Daily). Please share current monthly pricing and delivery timing for my area.`;
    const url = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-gold-300/60 shadow-lg relative overflow-hidden">
        {/* Subtle decorative gold glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-forest-700" />
            <span>Daily Morning Delivery</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900 tracking-tight leading-tight">
            Never run out of pure milk. <br />
            <span className="text-gold-700">Daily Morning Farm Delivery</span> at your doorstep.
          </h2>

          <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-2xl">
            Set up a hassle-free daily morning routine. Freshly collected from our farm at dawn, cold-chain chilled, and brought straight to your home across Dera Ismail Khan before you wake up.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-forest-800 bg-forest-50/40 shadow-md ring-1 ring-forest-800'
                    : 'border-borderCream bg-white hover:border-gold-300 hover:shadow-xs'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 right-4 bg-gold-500 text-forest-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    {plan.tag}
                  </span>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-forest-900">{plan.title}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-forest-800 bg-forest-800 text-white' : 'border-borderCream'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  <p className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                    {plan.subtitle}
                  </p>

                  <p className="text-xs text-muted leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-borderCream/60 flex items-center justify-between text-xs">
                  <span className="text-forest-700 font-semibold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Delivered 7:00 – 8:30 AM</span>
                  </span>
                  <span className="text-muted text-[11px]">Pause anytime</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits bar & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-borderCream">
          <div className="flex flex-wrap items-center gap-4 text-xs text-forest-800">
            <span className="flex items-center space-x-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero contract &middot; Pause or cancel anytime</span>
            </span>
            <span className="flex items-center space-x-1.5 font-medium">
              <Check className="w-4 h-4 text-gold-600" />
              <span>Weekly or Monthly billing options</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleSubscribe(selectedPlan)}
            className="btn-gold-shimmer px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Setup Daily Delivery on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
