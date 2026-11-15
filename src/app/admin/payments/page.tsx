import React from 'react';
import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import PaymentsManager from '@/components/admin/PaymentsManager';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Payments & UBL Verification | Admin | SUNNY Dairy',
  description: 'Manage and manually verify customer advance bank transfer payments.',
};

export default async function AdminPaymentsPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
      <PaymentsManager />
    </div>
  );
}
