'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageSquare } from 'lucide-react';
import { OFFICIAL_PHONE_NUMBER, OFFICIAL_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Kya doodh mein koi paani ya chemical ki milaawat hoti hai?',
      a: 'Bilkul nahi. SUNNY Dairy ka sab se pehla usool "Zero Water Dilution" hai. Har subah milking ke baad lactometer aur lab tests ke zariye fat content aur purity check ki jati hai. Doodh mein na koi paani milaya jata hai aur na hi koi chemical ya powder.',
    },
    {
      q: 'Doodh kacha hota hai ya ubla hua (boiled)?',
      a: 'Hamara doodh 100% natural raw fresh whole milk hota hai jo milking ke foran baad stainless steel chillers mein 4°C se kam darja-hararat par chill kiya jata hai. Ghar pohnchne ke baad aap isey aam tareeqay se ubaal kar istemal karein. Ubalne par is par gaari, moti malaai ki teh aayegi.',
    },
    {
      q: 'Order karne ka tareeqa aur delivery timing kya hai?',
      a: 'Aap website par Add to Cart kar ke ya seedha WhatsApp par message kar ke order kar sakte hain. Subah ki delivery timing 7:00 AM se 11:30 AM tak hoti hai. Dera Ismail Khan ke tamam ilaaqon (Cantt, Circular Road, Bannu Road, Mandra, waghaira) mein riders doorstep delivery karte hain.',
    },
    {
      q: 'Payment kaise karni hoti hai?',
      a: 'Sab se aasan tareeqa Cash on Delivery hai — rider jab aapke ghar fresh doodh pohnchaye to aap quality inspect kar ke cash ada karein. Iske ilawa UBL advance bank transfer ka option bhi available hai.',
    },
    {
      q: 'Kya rozana rozana (monthly subscription) doodh lagwaya ja sakta hai?',
      a: 'Jee haan! Aap rozana 1 Litre, 2 Litre ya 5 Litre ka subscription le sakte hain. Kisi din delivery roknii ho ya zyada doodh chahiye ho to aap sirf WhatsApp par aik message bhej kar routine adjust karwa sakte hain.',
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
              <span>Aapke Sawalat</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900 tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Khales doodh aur delivery se mutalliq aam sawalat ke tasalli-bakhsh jawabat. Mazeed koi sawal ho to direct rabta karein:
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
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam-o-Alaikum! Mujhe SUNNY Dairy ke baare mein poochna hai.')}`}
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
