'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Phone, Search } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { OFFICIAL_PHONE_NUMBER } from '@/lib/whatsapp';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Our Promise', href: '/our-promise' },
    { label: 'Delivery & FAQ', href: '/delivery' },
    { label: 'Track Order', href: '/track' },
    { label: 'Contact', href: '/contact' },
  ];

  // Hide public navbar on admin pages except login
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (isAdminPath) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-borderCream/70 transition-all duration-200">
      {/* Top quick banner */}
      <div className="bg-forest-900 text-cream-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">100% Pure Dairy · Direct Farm Delivery in Dera Ismail Khan</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Link href="/track" className="hover:text-gold-300 transition-colors flex items-center space-x-1">
              <Search className="w-3 h-3" />
              <span>Track Order</span>
            </Link>
            <span className="text-forest-600">|</span>
            <a
              href={`tel:${OFFICIAL_PHONE_NUMBER}`}
              className="hover:text-gold-300 transition-colors flex items-center space-x-1 font-semibold"
            >
              <Phone className="w-3 h-3 text-gold-400" />
              <span>Call: {OFFICIAL_PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with official logo.png */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="SUNNY Dairy"
                width={56}
                height={56}
                priority
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-forest-800 leading-tight">
                SUNNY <span className="text-gold-600">Dairy</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold mt-0.5">
                Pure & Farm Fresh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-forest-800 ${
                    isActive ? 'text-forest-800 font-bold border-b-2 border-forest-800 pb-1' : 'text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Live Cart Pill Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping Cart with ${totalItemCount} items`}
              className="flex items-center space-x-2.5 bg-forest-800 hover:bg-forest-900 text-white px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
                Basket
              </span>
              <span className="bg-gold-500 text-forest-950 text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {totalItemCount}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 text-forest-800 hover:text-forest-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-50 border-b border-borderCream px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-100 text-forest-800 font-bold'
                      : 'text-forest-800 hover:bg-cream-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-borderCream/60 flex flex-col space-y-2.5">
            <a
              href={`tel:${OFFICIAL_PHONE_NUMBER}`}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-forest-800 font-bold bg-white rounded-xl border border-borderCream"
            >
              <Phone className="w-4 h-4 text-gold-600" />
              <span>Call Sanaullah: {OFFICIAL_PHONE_NUMBER}</span>
            </a>
            <div className="flex items-center justify-between px-3 text-xs text-muted pt-1">
              <span>SUNNY Dairy Farm, Dera Ismail Khan</span>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-forest-800 underline"
              >
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
