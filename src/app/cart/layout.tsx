import type { Metadata } from 'next';
import { OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: `Your Shopping Cart — ${OFFICIAL_STORE_NAME}`,
  description: 'Review your selected fresh milk, butter, and traditional sweets before proceeding to checkout.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
