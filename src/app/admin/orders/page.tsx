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
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-borderCream">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-forest-900 tracking-tight">
            Orders
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Review inbound orders, confirm daily batch prices, and track delivery progress.
          </p>
        </div>
      </div>

      <OrdersManager />
    </div>
  );
}
