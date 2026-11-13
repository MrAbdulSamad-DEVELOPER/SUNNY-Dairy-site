'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  Layers,
  Boxes,
  Users,
  FileText,
  Palette,
  Settings,
  Truck,
  BarChart3,
  Shield,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/admin/login' || pathname === '/admin/setup') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Website Content', href: '/admin/content', icon: FileText },
    { label: 'Branding & Logo', href: '/admin/branding', icon: Palette },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
    { label: 'Delivery Settings', href: '/admin/delivery', icon: Truck },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Admin Users', href: '/admin/users', icon: Shield },
    { label: 'Activity Logs', href: '/admin/activity', icon: History },
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden bg-forest-900 text-cream-100 border-b border-forest-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white/10 p-1">
            <Image src="/logo.png" alt="SUNNY Dairy" fill className="object-contain" />
          </div>
          <span className="font-serif font-bold text-base text-white">SUNNY Dairy Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-forest-200 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop / Responsive Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-forest-950 text-cream-100 flex flex-col border-r border-forest-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-forest-850 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-xl bg-white p-1 shadow-sm flex-shrink-0">
              <Image src="/logo.png" alt="SUNNY Dairy" fill className="object-contain" priority />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white block tracking-tight">
                SUNNY Dairy
              </span>
              <span className="text-[10px] font-semibold text-gold-400 uppercase tracking-widest block">
                Control Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-forest-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-forest-800 text-white font-bold shadow-sm ring-1 ring-gold-500/40'
                    : 'text-forest-200 hover:text-white hover:bg-forest-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-forest-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions: View Store & Logout */}
        <div className="p-4 border-t border-forest-850 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-forest-200 hover:text-white hover:bg-forest-900 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-gold-400" />
              <span>Public Storefront</span>
            </span>
            <span className="text-[10px] text-forest-400 font-mono">Live ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-red-300 hover:text-red-100 hover:bg-red-950/50 transition-colors font-semibold"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
