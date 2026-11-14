import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { SettingsProvider } from '@/lib/settings-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import NavigationProgressBar from '@/components/layout/NavigationProgressBar';

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

const SITE_URL = 'https://sunny-dairy-web.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'SUNNY Dairy — Fresh Milk & Traditional Dairy Dera Ismail Khan',
    template: '%s | SUNNY Dairy Dera Ismail Khan',
  },
  description:
    'Fresh cow milk, pure goat milk, cultured dahi, artisanal makhan, pure slow-cooked desi ghee, and traditional Pakistani sweets delivered daily to your doorstep in Dera Ismail Khan. Managed by Sanaullah.',
  keywords: [
    'SUNNY Dairy',
    'SUNNY Dairy Dera Ismail Khan',
    'khalis doodh dera ismail khan',
    'fresh milk delivery Dera Ismail Khan',
    'pure cow milk DI Khan',
    'fresh goat milk Pakistan',
    'asli desi ghee Dera Ismail Khan',
    'pure makhan butter',
    'fresh dahi yogurt',
    'traditional Pakistani sweets',
    'rabri doodh DI Khan',
    'khoya barfi',
    'Sanaullah dairy farm',
    'organic farm fresh dairy KPK',
    'dairy online shopping Pakistan',
    'subah ka taaza doodh',
    'D.I. Khan cantt milk delivery',
    'circular road fresh dairy',
    'pure unadulterated milk DI Khan',
  ],
  authors: [{ name: 'SUNNY Dairy', url: SITE_URL }, { name: 'Sanaullah', url: SITE_URL }],
  creator: 'SUNNY Dairy',
  publisher: 'SUNNY Dairy',
  verification: {
    google: 'google649ad5de74d5e22e',
  },
  other: {
    'geo.region': 'PK-KP',
    'geo.placename': 'Dera Ismail Khan',
    'geo.position': '31.8327;70.9024',
    'ICBM': '31.8327, 70.9024',
    'revisit-after': '1 days',
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'SUNNY Dairy — Pure Milk & Farm Fresh Dairy Dera Ismail Khan',
    description:
      'Pure morning milk, farm-fresh makhan, traditional slow-simmered desi ghee, and authentic sweets delivered across Dera Ismail Khan. Cash on delivery & advance bank transfer available.',
    url: SITE_URL,
    siteName: 'SUNNY Dairy',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'SUNNY Dairy Pure & Farm Fresh Dera Ismail Khan',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUNNY Dairy — Pure Milk & Farm Fresh Dairy Dera Ismail Khan',
    description:
      'Fresh milk, makhan, and desi ghee delivered daily to your door across Dera Ismail Khan. Managed by Sanaullah.',
    images: [`${SITE_URL}/logo.png`],
    creator: '@SunnyDairyPK',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#124B32',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'SUNNY Dairy',
      description:
        'Pure farm-fresh cow milk, goat milk, artisanal makhan, desi ghee, and traditional sweets delivered across Dera Ismail Khan.',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/shop?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': ['LocalBusiness', 'DairyFarm', 'Store'],
      '@id': `${SITE_URL}/#organization`,
      name: 'SUNNY Dairy',
      alternateName: ['SUNNY Dairy Pure & Farm Fresh', 'Sunny Dairy DI Khan'],
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/logo.png`,
      telephone: '+923449322930',
      email: 'sanaullah.ccs@gmail.com',
      priceRange: '₨100 - ₨5000',
      currenciesAccepted: 'PKR',
      paymentAccepted: 'Cash on Delivery, UBL Bank Transfer, Raast, Direct WhatsApp Order',
      founder: {
        '@type': 'Person',
        name: 'Sanaullah',
        jobTitle: 'Store Owner & Dairy Farm Manager',
      },
      areaServed: [
        {
          '@type': 'City',
          name: 'Dera Ismail Khan',
        },
        {
          '@type': 'Country',
          name: 'Pakistan',
        },
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+923449322930',
        contactType: 'customer service',
        areaServed: 'PK',
        availableLanguage: ['Urdu', 'English', 'Saraiki', 'Pashto'],
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'SUNNY Dairy Farm, Main Farm Route',
        addressLocality: 'Dera Ismail Khan',
        addressRegion: 'Khyber Pakhtunkhwa',
        postalCode: '29050',
        addressCountry: 'PK',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 31.8327,
        longitude: 70.9024,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '05:00',
          closes: '22:00',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '520',
        bestRating: '5',
        worstRating: '1',
      },
      sameAs: ['https://wa.me/96895234002'],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream-100 text-forest-800 antialiased selection:bg-gold-500 selection:text-white flex flex-col min-h-screen">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <SettingsProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <CartDrawer />
            <Footer />
            <FloatingWhatsApp />
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
