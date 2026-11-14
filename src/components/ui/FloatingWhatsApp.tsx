'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { OFFICIAL_STORE_NAME, OFFICIAL_WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { useStoreSettings } from '@/lib/settings-context';

function WhatsAppIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M16.002 0C7.164 0 0 7.164 0 16.002c0 2.825.738 5.578 2.14 7.999L.135 31.066a.801.801 0 00.98.98l7.262-1.905a15.932 15.932 0 007.625 1.943c8.838 0 16.002-7.164 16.002-16.002C32.004 7.164 24.84 0 16.002 0zm0 29.333c-2.483 0-4.908-.66-7.037-1.913l-.504-.298-5.02 1.317 1.34-4.89-.327-.52A13.272 13.272 0 012.667 16c0-7.364 5.97-13.333 13.335-13.333 7.365 0 13.335 5.969 13.335 13.333 0 7.365-5.97 13.333-13.335 13.333zm7.323-9.988c-.402-.201-2.378-1.173-2.746-1.307-.369-.134-.637-.201-.905.201-.268.402-1.039 1.307-1.274 1.575-.235.268-.469.301-.871.1-.402-.201-1.698-.626-3.234-1.996-1.195-1.066-2.002-2.383-2.237-2.785-.235-.402-.025-.619.176-.819.181-.18.402-.469.603-.704.201-.235.268-.402.402-.67.134-.268.067-.502-.034-.704-.101-.201-.905-2.179-1.24-2.983-.326-.784-.658-.677-.905-.69-.234-.012-.502-.014-.771-.014-.268 0-.704.101-1.072.502-.369.402-1.408 1.374-1.408 3.352s1.441 3.889 1.642 4.157c.201.268 2.836 4.331 6.87 6.072.96.414 1.708.662 2.292.846.963.307 1.84.264 2.532.16.773-.115 2.378-.972 2.713-1.911.335-.939.335-1.743.235-1.911-.1-.168-.368-.268-.77-.469z" />
    </svg>
  );
}

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const { settings } = useStoreSettings();

  // Hide on admin portal except login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  const activeStoreName = settings.store_name || OFFICIAL_STORE_NAME;
  const activeWhatsapp = settings.whatsapp_number || OFFICIAL_WHATSAPP_NUMBER;
  const defaultMsg = `Hello ${activeStoreName}! I want to order fresh farm milk and traditional dairy.`;
  const whatsappUrl = `https://wa.me/${activeWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <aside aria-label="Direct WhatsApp Contact" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order or Chat on WhatsApp with SUNNY Dairy"
        className="group relative flex items-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-[0_6px_28px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white ring-2 ring-emerald-500/30"
      >
        <div className="relative flex items-center justify-center">
          <WhatsAppIcon className="w-7 h-7 sm:w-6 sm:h-6 text-white transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute w-2 h-2 bg-emerald-500 rounded-full" />
          </span>
        </div>

        <div className="hidden sm:flex flex-col text-left ml-2.5 pr-1">
          <span className="text-[10px] font-medium leading-none text-emerald-100">Direct Farm Support</span>
          <span className="text-xs font-bold leading-tight mt-0.5 whitespace-nowrap">Order on WhatsApp</span>
        </div>
      </a>
    </aside>
  );
}
