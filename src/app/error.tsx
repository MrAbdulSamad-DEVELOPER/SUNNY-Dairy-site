'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, MessageSquare, AlertTriangle } from 'lucide-react';
import { OFFICIAL_STORE_NAME, OFFICIAL_STORE_OWNER, getWhatsAppUrl } from '@/lib/whatsapp';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  const directWhatsApp = getWhatsAppUrl(
    `Hello ${OFFICIAL_STORE_OWNER}! I encountered a technical issue on the ${OFFICIAL_STORE_NAME} website: ${error.message || 'Page error'}`
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-[#FFFDFA] p-8 sm:p-10 rounded-3xl border border-borderCream shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto text-amber-800 shadow-xs">
          <AlertTriangle className="w-7 h-7 text-amber-700" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block">
            Notice
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 tracking-tight">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            We encountered a temporary issue while loading this page. Please try reloading or reach out to us.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-gold-400" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-5 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-900 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4 text-forest-700" />
            <span>Return to Homepage</span>
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
