import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MessageSquare, ShoppingBag, Truck } from 'lucide-react';
import { OFFICIAL_STORE_NAME, OFFICIAL_STORE_OWNER, OFFICIAL_WHATSAPP_NUMBER, getWhatsAppUrl } from '@/lib/whatsapp';

export const metadata = {
  title: `Page Not Found (404) — ${OFFICIAL_STORE_NAME}`,
  description: 'The requested dairy product or page could not be found.',
};

export default function NotFound() {
  const directWhatsApp = getWhatsAppUrl(
    `Hello ${OFFICIAL_STORE_OWNER}! I was looking for a page on ${OFFICIAL_STORE_NAME} website but got a 404 error.`
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-[#FFFDFA] p-8 sm:p-10 rounded-3xl border border-borderCream shadow-sm">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto shadow-xs border border-borderCream">
          <img src="/logo.png" alt="SUNNY Dairy" className="w-10 h-10 object-contain" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700 block">
            Error 404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            The dairy product or page you are looking for may have moved or doesn&apos;t exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            href="/shop"
            className="w-full py-3 px-5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-gold-400" />
            <span>Browse Fresh Dairy & Sweets</span>
          </Link>

          <Link
            href="/track"
            className="w-full py-2.5 px-5 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-900 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Truck className="w-4 h-4 text-forest-700" />
            <span>Track Existing Order</span>
          </Link>

          <a
            href={directWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-5 rounded-xl border border-green-300 bg-green-50/70 hover:bg-green-100 text-green-900 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4 text-green-700" />
            <span>Contact {OFFICIAL_STORE_OWNER} on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
