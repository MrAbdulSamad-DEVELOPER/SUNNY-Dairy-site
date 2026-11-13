'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, MapPin, ShieldCheck, Heart } from 'lucide-react';
import {
  OFFICIAL_PHONE_NUMBER,
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_STORE_NAME,
  OFFICIAL_STORE_OWNER,
  getWhatsAppUrl,
} from '@/lib/whatsapp';

export default function Footer() {
  const pathname = usePathname();

  // If in admin dashboard (except login), don't render customer footer
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const whatsappUrl = getWhatsAppUrl(
    'Hello Sanaullah bhai! I would like to inquire about fresh milk and dairy orders from SUNNY Dairy.'
  );

  return (
    <footer className="bg-forest-900 text-cream-100 pt-16 pb-12 mt-20 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-forest-800">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="bg-white p-2 rounded-2xl shadow-sm inline-block">
                <Image
                  src="/logo.png"
                  alt="SUNNY Dairy"
                  width={150}
                  height={50}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-forest-200 text-sm leading-relaxed max-w-sm">
              Pure fresh cow milk, goat milk, traditional makhan, and authentic desi ghee delivered directly from our dairy farm to your doorstep in Dera Ismail Khan.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-gold-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Preservatives · 100% Raw Pure · Managed by {OFFICIAL_STORE_OWNER}</span>
            </div>
          </div>

          {/* Contact & Orders */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-lg font-semibold text-gold-400 tracking-wide">
              Farm & Direct Orders
            </h4>
            <div className="space-y-2.5 text-sm text-forest-200">
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>
                  <strong className="text-white">Call: </strong>
                  <a href={`tel:${OFFICIAL_PHONE_NUMBER}`} className="hover:text-gold-300 font-bold transition-colors">
                    {OFFICIAL_PHONE_NUMBER}
                  </a>
                </span>
              </p>
              <p className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-white">WhatsApp: </strong>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-300 font-bold transition-colors"
                  >
                    +{OFFICIAL_WHATSAPP_NUMBER}
                  </a>
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-forest-300">
                  SUNNY Dairy Farm, Dera Ismail Khan, Khyber Pakhtunkhwa, Pakistan
                </span>
              </p>
              <div className="pt-2 text-xs text-forest-300">
                Morning delivery schedule: 7:00 AM – 11:30 AM daily
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-lg font-semibold text-gold-400 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-forest-200">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-gold-300 font-semibold transition-colors flex items-center space-x-1">
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <Link href="/our-promise" className="hover:text-white transition-colors">
                  Our Promise & Quality
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-white transition-colors">
                  Delivery Zones & FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors text-xs text-forest-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors text-xs text-forest-400">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-400 space-y-4 sm:space-y-0">
          <p>© {currentYear} {OFFICIAL_STORE_NAME}. Owned & Operated by {OFFICIAL_STORE_OWNER}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/admin/login" className="hover:text-gold-300 transition-colors">
              Staff Portal
            </Link>
            <span className="text-forest-500">Pure Farm Dairy · Dera Ismail Khan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
