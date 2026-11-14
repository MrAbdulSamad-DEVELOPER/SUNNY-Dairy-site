'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useStoreSettings } from '@/lib/settings-context';
import { OFFICIAL_PHONE_NUMBER } from '@/lib/whatsapp';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { settings } = useStoreSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // If mobile menu is open, keep navbar pinned visible
          if (mobileMenuOpen) {
            setIsVisible(true);
            setLastScrollY(currentScrollY);
            ticking = false;
            return;
          }

          // At top of page, always show
          if (currentScrollY < 50) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
            // Scrolling down -> hide navbar smoothly
            setIsVisible(false);
          } else if (lastScrollY - currentScrollY > 6) {
            // Scrolling up -> reveal navbar smoothly
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  // Navbar specifically uses /nev-logo.png as instructed
  const activeLogo = '/nev-logo.png';
  const activeStoreName = settings.store_name || 'SUNNY Dairy';
  const activePhone = settings.store_phone || OFFICIAL_PHONE_NUMBER;

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

  const nameParts = activeStoreName.split(' ');
  const firstName = nameParts[0] || 'SUNNY';
  const restName = nameParts.slice(1).join(' ') || 'Dairy';

  return (
    <header
      className={`sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-borderCream/70 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo with dynamic branding - perfectly bounded to prevent overlapping */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0 flex-shrink">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex-shrink-0 flex items-center justify-center">
              <img
                src={activeLogo}
                alt={activeStoreName}
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-tight text-forest-800 leading-tight whitespace-nowrap">
                {firstName} <span className="text-gold-600">{restName}</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted font-bold mt-0.5 whitespace-nowrap hidden sm:block">
                Pure & Farm Fresh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - active on lg screens (>= 1024px) for flawless spacing */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-forest-800 whitespace-nowrap ${
                    isActive ? 'text-forest-800 font-bold border-b-2 border-forest-800 pb-1' : 'text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions - flex-shrink-0 to guarantee basket and menu never collide */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Live Cart Pill Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping Cart with ${totalItemCount} items`}
              className="flex items-center space-x-1.5 sm:space-x-2 bg-forest-800 hover:bg-forest-900 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all duration-200 shadow-sm active:scale-95 flex-shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
                Basket
              </span>
              <span className="bg-gold-500 text-forest-950 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                {totalItemCount}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-1.5 sm:p-2 text-forest-800 hover:text-forest-900 rounded-lg hover:bg-cream-200 focus:outline-none flex-shrink-0 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-50 border-b border-borderCream px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fade-in">
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
                href="/admin"
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
