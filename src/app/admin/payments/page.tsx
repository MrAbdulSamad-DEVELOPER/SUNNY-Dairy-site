import React from 'react';
import PaymentsManager from '@/components/admin/PaymentsManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payments & UBL Verification | Admin | SUNNY Dairy',
  description: 'Manage and manually verify customer advance bank transfer payments.',
};

export default function AdminPaymentsPage() {
  return <PaymentsManager />;
}
