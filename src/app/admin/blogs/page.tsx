import React from 'react';
import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import BlogsManager from '@/components/admin/BlogsManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBlogsPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      <BlogsManager />
    </div>
  );
}
