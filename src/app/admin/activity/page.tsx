import React from 'react';
import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import ActivityLogsViewer from '@/components/admin/ActivityLogsViewer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminActivityPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto w-full max-w-full min-w-0">
        <ActivityLogsViewer />
      </div>
    </div>
  );
}
