'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { getWhatsAppUrl, OFFICIAL_STORE_NAME, OFFICIAL_WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { useStoreSettings } from '@/lib/settings-context';

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
    <aside aria-label="Direct WhatsApp Contact" className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order or Chat on WhatsApp with SUNNY Dairy"
        className="group flex items-center space-x-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/80"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-current text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] font-medium leading-none text-emerald-100">Direct Farm Support</span>
          <span className="text-xs font-bold leading-tight mt-0.5">Order on WhatsApp</span>
        </div>
      </a>
    </aside>
  );
}
