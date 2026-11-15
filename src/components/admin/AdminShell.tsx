'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/setup' ||
    pathname === '/admin/reset-password';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex flex-col text-forest-900 w-full max-w-full overflow-x-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col lg:flex-row text-forest-900 w-full max-w-full overflow-x-hidden">
      <AdminNav />
      <div className="flex-1 lg:pl-64 min-w-0 max-w-full w-full flex flex-col overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
