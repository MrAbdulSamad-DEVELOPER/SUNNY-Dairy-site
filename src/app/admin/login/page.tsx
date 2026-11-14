import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Sign In — SUNNY Dairy Operations',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (isAuth) {
    redirect('/admin');
  }

  return <AdminLoginForm />;
}
