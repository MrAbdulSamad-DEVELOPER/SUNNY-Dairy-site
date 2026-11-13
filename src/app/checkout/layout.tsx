import type { Metadata } from 'next';
import { OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: `Secure Checkout — ${OFFICIAL_STORE_NAME}`,
  description: 'Complete your fresh milk order with Cash on Delivery or Advance UBL Bank Transfer.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
