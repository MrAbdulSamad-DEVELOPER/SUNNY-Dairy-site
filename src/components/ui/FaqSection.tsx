'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageSquare } from 'lucide-react';
import { OFFICIAL_PHONE_NUMBER, OFFICIAL_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is there any water dilution or chemicals added to the milk?',
      a: 'Absolutely not. SUNNY Dairy strictly adheres to a Zero Water Dilution policy. Every morning after milking, fat content and purity are verified using lactometers and testing kits. We never add water, preservatives, chemicals, or milk powder.',
    },
    {
      q: 'Is the milk raw or boiled?',
      a: 'Our milk is 100% natural, fresh raw whole milk chilled immediately after milking to below 4°C in food-grade stainless steel chillers. Once delivered to your home, simply boil it following normal kitchen practice. When boiled, you will notice a thick, rich layer of natural clotted cream.',
    },
    {
      q: 'How do I place an order and what are the delivery hours?',
      a: 'You can easily place an order through our website by adding products to your cart, or message us directly via WhatsApp. Morning deliveries take place between 7:00 AM and 11:30 AM across all major areas of Dera Ismail Khan (Cantt, Circular Road, Bannu Road, Mandra, and surrounding areas).',
    },
    {
      q: 'What payment methods are available?',
      a: 'Our most popular option is Cash on Delivery (COD) — inspect your fresh dairy at your doorstep upon delivery and pay the rider directly. We also accept advance direct bank transfers via UBL.',
    },
    {
      q: 'Can I set up a daily or monthly milk subscription?',
      a: 'Yes! You can subscribe for daily delivery of 1 Liter, 2 Liters, 5 Liters, or more. If you ever need to pause delivery or adjust your order quantity, simply notify us via WhatsApp with a single message to adjust your routine.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-[#FAF3E4]/70 rounded-3xl p-6 sm:p-10 lg:p-12 border border-borderCream">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-forest-700" />
              <span>Your Questions</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900 tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Clear answers to common questions about our fresh milk and doorstep delivery. For any further assistance, feel free to contact us directly:
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={`tel:${OFFICIAL_PHONE_NUMBER}`}
                className="px-4 py-2.5 bg-white border border-borderCream text-forest-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 hover:bg-cream-100 transition-colors"
              >
                <Phone className="w-4 h-4 text-gold-600" />
                <span>Call Sanaullah: {OFFICIAL_PHONE_NUMBER}</span>
              </a>
              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello! I would like to inquire about SUNNY Dairy products and delivery.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-borderCream/80 overflow-hidden shadow-2xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 focus:outline-none"
                  >
                    <span className="font-bold text-forest-900 text-xs sm:text-sm leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-forest-700 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180 text-gold-700' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-forest-800/90 leading-relaxed border-t border-cream-100 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
