import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SUNNY Dairy — Fresh Milk & Traditional Dairy Dera Ismail Khan',
  description:
    'Fresh cow milk, pure goat milk, cultured dahi, artisanal makhan, pure desi ghee, and traditional Pakistani sweets delivered daily to your door across Dera Ismail Khan. Managed by Sanaullah.',
  keywords: [
    'SUNNY Dairy',
    'fresh milk Dera Ismail Khan',
    'desi ghee Pakistan',
    'pure makhan',
    'cow milk',
    'goat milk',
    'dahi',
    'rabri',
    'barfi',
    'traditional Pakistani sweets',
    'Sanaullah dairy',
    'DI Khan dairy',
  ],
  authors: [{ name: 'SUNNY Dairy' }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://sunny-dairy.vercel.app')
  ),
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://sunny-dairy.vercel.app'),
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'SUNNY Dairy — Fresh Milk & Traditional Dairy Dera Ismail Khan',
    description: 'Fresh milk, makhan and desi ghee delivered with cash on delivery across Dera Ismail Khan.',
    url:
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://sunny-dairy.vercel.app'),
    siteName: 'SUNNY Dairy',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'SUNNY Dairy Farm Fresh',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#124B32',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-cream-100 text-forest-800 antialiased selection:bg-gold-500 selection:text-white flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <CartDrawer />
          <FloatingWhatsApp />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
