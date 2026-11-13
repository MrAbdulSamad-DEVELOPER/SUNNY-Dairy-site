import type { Metadata } from 'next';
import { OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

const SITE_URL = 'https://sunny-dairy-web.vercel.app';

export const metadata: Metadata = {
  title: `Track Your Order — ${OFFICIAL_STORE_NAME}`,
  description:
    'Check real-time delivery status, price confirmations, and rider dispatch updates for your fresh dairy order in Dera Ismail Khan using your Order Number or Phone Number.',
  alternates: {
    canonical: `${SITE_URL}/track`,
  },
  openGraph: {
    title: `Track Your Dairy Order — ${OFFICIAL_STORE_NAME}`,
    description:
      'Track order confirmation, dispatch progress, and delivery updates in Dera Ismail Khan.',
    url: `${SITE_URL}/track`,
    type: 'website',
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
