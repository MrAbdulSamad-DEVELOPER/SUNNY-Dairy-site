import React from 'react';
import AdminNav from '@/components/admin/AdminNav';

export const metadata = {
  title: 'Admin Dashboard — SUNNY Dairy',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col lg:flex-row text-forest-900 w-full max-w-full overflow-x-hidden">
      <AdminNav />
      <main className="flex-1 lg:pl-64 min-w-0 max-w-full w-full flex flex-col overflow-x-hidden">{children}</main>
    </div>
  );
}
