import React from 'react';
import PaymentsManager from '@/components/admin/PaymentsManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payments & UBL Verification | Admin | SUNNY Dairy',
  description: 'Manage and manually verify customer advance bank transfer payments.',
};

export default function AdminPaymentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
      <PaymentsManager />
    </div>
  );
}
