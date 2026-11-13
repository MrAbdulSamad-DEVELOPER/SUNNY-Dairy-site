import React from 'react';
import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import BrandingManager from '@/components/admin/BrandingManager';

export const dynamic = 'force-dynamic';

export default async function AdminBrandingPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <BrandingManager />
    </div>
  );
}
