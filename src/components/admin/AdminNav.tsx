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

  const storeGroups = [
    {
      group: 'STORE MANAGEMENT',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Categories', href: '/admin/categories', icon: Layers },
        { label: 'Stock & Inventory', href: '/admin/inventory', icon: Boxes },
        { label: 'Bank Payments', href: '/admin/payments', icon: CreditCard },
      ],
    },
    {
      group: 'STORE CONFIGURATION',
      items: [
        { label: 'Store & Bank Settings', href: '/admin/settings', icon: Settings },
        { label: 'Delivery & Shipping', href: '/admin/delivery', icon: Truck },
        { label: 'Logo & Branding', href: '/admin/branding', icon: Palette },
        { label: 'Customers', href: '/admin/customers', icon: Users },
        { label: 'Admin Accounts', href: '/admin/users', icon: Shield },
      ],
    },
    {
      group: 'SYSTEM & REPORTS',
      items: [
        { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Sales Reports', href: '/admin/reports', icon: BarChart3 },
        { label: 'Website Content', href: '/admin/content', icon: FileText },
        { label: 'Activity Logs', href: '/admin/activity', icon: History },
      ],
    },
  ];

  return (
    <>
      {/* Top Mobile Bar - specifically designed to never collide with iPhone notch/island */}
      <header className="lg:hidden bg-forest-950 text-cream-100 border-b border-forest-800 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="relative w-7 h-7 rounded-md overflow-hidden bg-white p-0.5 flex-shrink-0 shadow-xs">
            <Image src="/logo.png" alt="SUNNY Dairy" fill className="object-contain" priority />
          </div>
          <div className="flex items-baseline space-x-1.5 truncate">
            <span className="font-bold text-sm text-white tracking-tight">Sunny</span>
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider bg-forest-900 px-1.5 py-0.5 rounded">Admin</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="text-[11px] font-semibold text-forest-200 hover:text-white bg-forest-900/90 px-2.5 py-1.5 rounded-lg border border-forest-800 flex items-center space-x-1"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-gold-400" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg text-white bg-forest-900 hover:bg-forest-800 border border-forest-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Desktop / Responsive Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-forest-950 text-cream-100 flex flex-col border-r border-forest-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-forest-850 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-white p-1 shadow-sm flex-shrink-0">
              <Image src="/logo.png" alt="SUNNY Dairy" fill className="object-contain" priority />
            </div>
            <div>
              <span className="font-bold text-sm text-white block tracking-tight">
                SUNNY Dairy
              </span>
              <span className="text-[10px] font-semibold text-gold-400 uppercase tracking-widest block">
                Admin Panel
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-forest-300 hover:text-white rounded-lg hover:bg-forest-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links Grouped for Simplicity */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs scrollbar-none">
          {storeGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-forest-400 uppercase tracking-wider block">
                {grp.group}
              </span>
              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-forest-800 text-white font-bold shadow-xs ring-1 ring-gold-500/30'
                          : 'text-forest-200 hover:text-white hover:bg-forest-900/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-gold-400' : 'text-forest-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Actions: View Store & Logout */}
        <div className="p-3 border-t border-forest-850 space-y-1 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-forest-200 hover:text-white hover:bg-forest-900 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              <span>Visit Live Store</span>
            </span>
            <span className="text-[10px] text-forest-400 font-mono">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-red-300 hover:text-red-100 hover:bg-red-950/40 transition-colors font-semibold"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
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
