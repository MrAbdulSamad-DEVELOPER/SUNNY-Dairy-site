import React from 'react';
import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import OrdersManager from '@/components/admin/OrdersManager';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          Dispatch & Orders
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest-800">
          Order Management & Price Confirmations
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Review inbound customer orders, confirm daily batch prices for unpriced items, and track delivery progress.
        </p>
      </div>

      <OrdersManager />
    </div>
  );
}
