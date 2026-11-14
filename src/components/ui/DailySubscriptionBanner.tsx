'use client';

import React, { useState } from 'react';
import { Calendar, Check, MessageSquare, ArrowRight, Clock, ShieldCheck, Plus, Minus, Sliders } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function DailySubscriptionBanner() {
  const [selectedPlan, setSelectedPlan] = useState<'1L' | '3L' | 'custom'>('3L');
  const [customLitres, setCustomLitres] = useState<number>(4);

  const plans = [
    {
      id: '1L' as const,
      title: '1 Litre Daily',
      subtitle: 'Singles & Morning Tea Lovers',
      description: 'Pure morning cow milk in sealed sterilized packaging delivered daily before 8:30 AM.',
      tag: 'Starter Plan',
    },
    {
      id: '3L' as const,
      title: '3 Litres Daily',
      subtitle: 'Most Popular for Families',
      description: 'Ideal for breakfast, fresh homemade yogurt, children nutrition, and evening tea.',
      tag: 'Family Choice',
      featured: true,
    },
  ];

  const handleSubscribe = () => {
    const qtyText = selectedPlan === 'custom' 
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

        {/* Plan Cards: 1 Litre, 3 Litres, Custom */}
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

          {/* Card 3: Custom Litres Plan */}
          {(() => {
            const isSelected = selectedPlan === 'custom';
            return (
              <div
                onClick={() => setSelectedPlan('custom')}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-forest-800 bg-forest-50/40 shadow-md ring-1 ring-forest-800'
                    : 'border-borderCream bg-white hover:border-gold-300 hover:shadow-xs'
                }`}
              >
                <span className="absolute -top-3 right-4 bg-forest-800 text-gold-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                  <Sliders className="w-2.5 h-2.5" />
                  <span>Custom Litres</span>
                </span>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-forest-900">Custom Litres</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-forest-800 bg-forest-800 text-white' : 'border-borderCream'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  <p className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                    Select Your Exact Daily Need
                  </p>

                  <p className="text-xs text-muted leading-relaxed">
                    Choose any daily quantity tailored for joint families, hostels, offices, or special dietary requirements.
                  </p>

                  {/* Interactive Quantity Stepper */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan('custom');
                    }}
                    className="p-2.5 rounded-xl bg-white border border-borderCream space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between space-x-2">
                      <button
                        type="button"
                        onClick={() => setCustomLitres((prev) => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-cream-200 border border-borderCream text-forest-900 font-bold flex items-center justify-center active:scale-95 transition-all"
                        aria-label="Decrease litres"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-1 text-center font-bold text-forest-900 text-sm">
                        {customLitres} {customLitres === 1 ? 'Litre' : 'Litres'} Daily
                      </div>

                      <button
                        type="button"
                        onClick={() => setCustomLitres((prev) => Math.min(50, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-cream-200 border border-borderCream text-forest-900 font-bold flex items-center justify-center active:scale-95 transition-all"
                        aria-label="Increase litres"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick selection pills */}
                    <div className="flex items-center justify-center space-x-1.5 pt-1">
                      {[2, 4, 6, 10].map((litres) => (
                        <button
                          key={litres}
                          type="button"
                          onClick={() => {
                            setCustomLitres(litres);
                            setSelectedPlan('custom');
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            customLitres === litres
                              ? 'bg-forest-800 text-white'
                              : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
                          }`}
                        >
                          {litres}L
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-borderCream/60 flex items-center justify-between text-xs">
                  <span className="text-forest-700 font-semibold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Delivered 7:00 – 8:30 AM</span>
                  </span>
                  <span className="text-muted text-[11px]">Pause anytime</span>
                </div>
              </div>
            );
          })()}
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
            onClick={handleSubscribe}
            className="btn-gold-shimmer px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{getButtonText()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
