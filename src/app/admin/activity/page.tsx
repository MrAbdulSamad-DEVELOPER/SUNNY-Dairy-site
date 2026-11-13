import React from 'react';
import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import ActivityLogsViewer from '@/components/admin/ActivityLogsViewer';

export const dynamic = 'force-dynamic';

export default async function AdminActivityPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
      <ActivityLogsViewer />
    </div>
  );
}
