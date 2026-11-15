'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageSquare } from 'lucide-react';
import { OFFICIAL_PHONE_NUMBER, OFFICIAL_WHATSAPP_NUMBER } from '@/lib/whatsapp';

interface FaqSectionProps {
  cmsData?: {
    isEnabled?: boolean;
    title?: string;
    subtitle?: string;
    content?: string;
    metadata?: string;
  };
}

export default function FaqSection({ cmsData }: FaqSectionProps) {
  if (cmsData?.isEnabled === false) {
    return null;
  }

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  let faqs = [
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
      q: 'Where can I buy 100% pure clarified butter (desi ghee) online in Pakistan?',
      a: 'You can order 100% pure artisanal clarified butter directly from SUNNY Dairy online. Our ghee is slow-simmered over low heat from pure cultured farm butter, sealed in airtight glass jars, and delivered to your doorstep in Dera Ismail Khan, Islamabad, Lahore, Karachi, and nationwide with zero hydrogenated vegetable fats.',
    },
    {
      q: 'How is farm-fresh milk kept chilled during delivery in Pakistan?',
      a: 'Milk is chilled immediately below 4°C at dawn in sanitized stainless steel bulk tanks. For local delivery in Dera Ismail Khan and express courier transit across Pakistan, our logistics use insulated thermal packaging with frozen ice packs that keep the temperature strictly below 4°C until handover.',
    },
    {
      q: 'Do you deliver nationwide across major cities in Pakistan?',
      a: 'Yes! While daily raw milk is delivered every morning across Dera Ismail Khan, our pure clarified butter (desi ghee), churned farm butter, and traditional milk sweets are safely packaged in airtight containers and shipped nationwide across Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, and other major cities.',
    },
    {
      q: 'What payment methods are available?',
      a: 'Our most popular option is Cash on Delivery (COD) — inspect your fresh dairy upon delivery and pay the rider directly. We also accept advance direct bank transfers via UBL and Raast Instant Pay for all orders.',
    },
    {
      q: 'Can I set up a daily or monthly milk subscription?',
      a: 'Yes! You can subscribe for daily delivery of 1 Liter, 2 Liters, 5 Liters, or more. If you ever need to pause delivery or adjust your order quantity, simply notify us via WhatsApp with a single message to adjust your routine.',
    },
  ];

  if (cmsData?.metadata) {
    try {
      const parsed = typeof cmsData.metadata === 'string' ? JSON.parse(cmsData.metadata) : cmsData.metadata;
      if (Array.isArray(parsed) && parsed.length > 0) {
        faqs = parsed;
      }
    } catch {}
  }

  const badgeText = cmsData?.subtitle || 'Your Questions';
  const headingText = cmsData?.title || 'Frequently Asked Questions & Purity Standards';
  const subText =
    cmsData?.content ||
    'Transparent facts about our daily morning milking cycle, cold-chain temperature preservation, and doorstep delivery across Pakistan.';

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
              <span>{badgeText}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900 tracking-tight leading-tight">
              {headingText}
            </h2>

            <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
              {subText}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=Hello%20SUNNY%20Dairy!%20I%20have%20a%20question%20about%20your%20products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask on WhatsApp</span>
              </a>

              <a
                href={`tel:${OFFICIAL_PHONE_NUMBER}`}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-forest-200 text-forest-800 text-xs font-bold hover:bg-forest-50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-forest-600" />
                <span>Call Us Directly</span>
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
                  className="bg-white rounded-2xl border border-cream-200 overflow-hidden transition-shadow shadow-xs hover:shadow-sm"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between space-x-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-sm sm:text-base text-forest-900">
                      {faq.q}
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full bg-forest-50 flex items-center justify-center text-forest-700 transition-transform flex-shrink-0 ${
                        isOpen ? 'rotate-180 bg-gold-100 text-gold-800' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-forest-700 leading-relaxed border-t border-cream-100">
                      <p className="pt-3">{faq.a}</p>
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
