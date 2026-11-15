'use client';

import React, { useState } from 'react';
import { Calendar, Check, MessageSquare, ArrowRight, Clock, ShieldCheck, Plus, Minus, Sliders } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '@/lib/whatsapp';

interface DailySubscriptionBannerProps {
  cmsData?: {
    isEnabled?: boolean;
    title?: string;
    subtitle?: string;
    content?: string;
    metadata?: string;
  };
}

export default function DailySubscriptionBanner({ cmsData }: DailySubscriptionBannerProps) {
  if (cmsData?.isEnabled === false) {
    return null;
  }

  const [selectedPlan, setSelectedPlan] = useState<'1L' | '3L' | 'custom'>('3L');
  const [customLitres, setCustomLitres] = useState<number>(4);

  let parsedMeta: any = {};
  if (cmsData?.metadata) {
    try {
      parsedMeta = typeof cmsData.metadata === 'string' ? JSON.parse(cmsData.metadata) : cmsData.metadata;
    } catch {}
  }

  const badgeText = cmsData?.subtitle || 'Daily Morning Delivery';
  const mainTitle = cmsData?.title || 'Never run out of pure milk. Daily Morning Farm Delivery at your doorstep.';
  const mainContent =
    cmsData?.content ||
    'Set up a hassle-free daily morning routine. Freshly collected from our farm at dawn, cold-chain chilled, and brought straight to your home across Dera Ismail Khan before you wake up.';

  const plan1Title = parsedMeta.plan1Title || '1 Litre Daily';
  const plan1Subtitle = parsedMeta.plan1Subtitle || 'Singles & Morning Tea Lovers';
  const plan1Desc = parsedMeta.plan1Desc || 'Pure morning cow milk in sealed sterilized packaging delivered daily before 8:30 AM.';

  const plan2Title = parsedMeta.plan2Title || '3 Litres Daily';
  const plan2Subtitle = parsedMeta.plan2Subtitle || 'Most Popular for Families';
  const plan2Desc = parsedMeta.plan2Desc || 'Ideal for breakfast, fresh homemade yogurt, children nutrition, and evening tea.';

  const handleSubscribe = () => {
    const qtyText =
      selectedPlan === 'custom'
        ? `${customLitres} ${customLitres === 1 ? 'Litre' : 'Litres'}`
        : selectedPlan === '1L'
        ? '1 Litre'
        : '3 Litres';

    const text = `Hello! I would like to inquire about the SUNNY Dairy Daily Milk Subscription (${qtyText} Daily). Please share current monthly pricing and delivery timing for my area in Dera Ismail Khan.`;
    const url = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getButtonText = () => {
    if (selectedPlan === 'custom') {
      return `Setup ${customLitres} ${customLitres === 1 ? 'Litre' : 'Litres'} Daily on WhatsApp`;
    }
    if (selectedPlan === '1L') {
      return 'Setup 1 Litre Daily on WhatsApp';
    }
    return 'Setup 3 Litres Daily on WhatsApp';
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-gold-300/60 shadow-lg relative overflow-hidden">
        {/* Subtle decorative gold glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-forest-700" />
            <span>{badgeText}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-900 tracking-tight leading-tight">
            {mainTitle}
          </h2>

          <p className="text-sm sm:text-base text-forest-700 leading-relaxed pt-1">
            {mainContent}
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* 1 Litre Plan */}
          <div
            onClick={() => setSelectedPlan('1L')}
            className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border-2 ${
              selectedPlan === '1L'
                ? 'bg-cream-50/80 border-forest-800 shadow-md ring-2 ring-forest-800/10'
                : 'bg-white border-cream-200 hover:border-forest-300 hover:shadow-xs'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600 bg-forest-100/60 px-2.5 py-0.5 rounded-full">
                Starter Plan
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedPlan === '1L' ? 'border-forest-800 bg-forest-800 text-white' : 'border-cream-300 bg-white'
                }`}
              >
                {selectedPlan === '1L' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="font-serif text-2xl font-bold text-forest-900 mb-1">{plan1Title}</div>
            <div className="text-xs font-medium text-gold-700 mb-3">{plan1Subtitle}</div>
            <p className="text-xs text-forest-600 leading-relaxed">{plan1Desc}</p>
          </div>

          {/* 3 Litres Plan (Featured) */}
          <div
            onClick={() => setSelectedPlan('3L')}
            className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border-2 ${
              selectedPlan === '3L'
                ? 'bg-cream-50/80 border-forest-800 shadow-md ring-2 ring-forest-800/10'
                : 'bg-white border-gold-300 hover:border-forest-300 hover:shadow-xs'
            }`}
          >
            <div className="absolute -top-3 left-6 bg-gold-500 text-forest-950 font-bold text-[10px] tracking-wider uppercase px-3 py-0.5 rounded-full shadow-xs">
              Family Choice
            </div>

            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600 bg-forest-100/60 px-2.5 py-0.5 rounded-full">
                Most Popular
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedPlan === '3L' ? 'border-forest-800 bg-forest-800 text-white' : 'border-cream-300 bg-white'
                }`}
              >
                {selectedPlan === '3L' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="font-serif text-2xl font-bold text-forest-900 mb-1">{plan2Title}</div>
            <div className="text-xs font-medium text-gold-700 mb-3">{plan2Subtitle}</div>
            <p className="text-xs text-forest-600 leading-relaxed">{plan2Desc}</p>
          </div>

          {/* Custom Litres Plan */}
          <div
            onClick={() => setSelectedPlan('custom')}
            className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border-2 ${
              selectedPlan === 'custom'
                ? 'bg-cream-50/80 border-forest-800 shadow-md ring-2 ring-forest-800/10'
                : 'bg-white border-cream-200 hover:border-forest-300 hover:shadow-xs'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600 bg-forest-100/60 px-2.5 py-0.5 rounded-full">
                Custom Volume
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedPlan === 'custom' ? 'border-forest-800 bg-forest-800 text-white' : 'border-cream-300 bg-white'
                }`}
              >
                {selectedPlan === 'custom' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="font-serif text-2xl font-bold text-forest-900 mb-1">
              {customLitres} {customLitres === 1 ? 'Litre' : 'Litres'} Daily
            </div>
            <div className="text-xs font-medium text-gold-700 mb-2">Tailored Household Supply</div>

            <div className="flex items-center space-x-3 pt-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan('custom');
                  setCustomLitres((prev) => Math.max(1, prev - 1));
                }}
                className="w-8 h-8 rounded-lg bg-forest-100 hover:bg-forest-200 text-forest-900 flex items-center justify-center font-bold transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold text-forest-900 font-mono w-6 text-center">{customLitres}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan('custom');
                  setCustomLitres((prev) => Math.min(20, prev + 1));
                }}
                className="w-8 h-8 rounded-lg bg-forest-100 hover:bg-forest-200 text-forest-900 flex items-center justify-center font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Bar & Trust Footnote */}
        <div className="bg-cream-100/70 rounded-2xl p-4 sm:p-6 border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-xs text-forest-700">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <span>Delivered 7:00 AM – 11:30 AM</span>
            </div>
            <div className="hidden sm:inline text-cream-300">•</div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Pause / Cancel anytime via WhatsApp</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubscribe}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl font-bold text-forest-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 shadow-md transition-all active:scale-95 text-xs sm:text-sm"
          >
            <MessageSquare className="w-4 h-4 fill-forest-950/20" />
            <span>{getButtonText()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
