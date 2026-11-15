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
    default: 'SUNNY Dairy — Farm-Fresh Milk, Butter & Clarified Butter | Pakistan',
    template: '%s | SUNNY Dairy',
  },
  description:
    'Order 100% pure farm-fresh cow milk, goat milk, churned butter, clarified butter, and traditional milk sweets online. Fast hygienic delivery across Dera Ismail Khan and nationwide Pakistan.',
  keywords: [
    'SUNNY Dairy',
    'SUNNY Dairy Pakistan',
    'SUNNY Dairy Oman',
    'pure farm milk Pakistan',
    'fresh cow milk delivery Dera Ismail Khan',
    'pure desi ghee online Pakistan',
    'fresh milk delivery Pakistan',
    'organic clarified butter Oman',
    'Pakistani pure desi ghee in Oman',
    'authentic Pakistani sweets for Oman expatriates',
    'pure goat milk Pakistan',
    'fresh churned farm butter',
    'fresh cultured whole milk yogurt',
    'traditional milk sweets Oman',
    'cardamom milk fudge delivery',
    'Sanaullah dairy farm manager',
    'zero water dilution milk',
    'cold chain milk delivery',
    'artisanal desi ghee Salalah Sohar',
    'pure unadulterated milk',
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
    title: 'SUNNY Dairy — Farm-Fresh Milk, Butter & Clarified Butter | Pakistan',
    description:
      'Order 100% pure farm-fresh cow milk, goat milk, churned butter, clarified butter, and traditional milk sweets online. Fast hygienic delivery across Dera Ismail Khan and nationwide Pakistan.',
    url: SITE_URL,
    siteName: 'SUNNY Dairy',
    images: [
      {
        url: `${SITE_URL}/nev-logo.png`,
        width: 1200,
        height: 630,
        alt: 'SUNNY Dairy Pure Farm Milk & Clarified Butter Pakistan',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUNNY Dairy — Farm-Fresh Milk, Butter & Clarified Butter | Pakistan',
    description:
      'Order 100% pure farm-fresh cow milk, goat milk, churned butter, clarified butter, and traditional milk sweets online. Fast hygienic delivery across Pakistan.',
    images: [`${SITE_URL}/nev-logo.png`],
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
        'Pure farm-fresh cow milk, goat milk, artisanal butter, desi ghee, and traditional sweets delivered across Dera Ismail Khan.',
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
      logo: `${SITE_URL}/nev-logo.png`,
      image: `${SITE_URL}/nev-logo.png`,
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
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+923129053896',
          contactType: 'customer service (Pakistan)',
          areaServed: 'PK',
          availableLanguage: ['English', 'Urdu', 'Pashto', 'Saraiki'],
        },
      ],
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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} overflow-x-hidden max-w-full`}>
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
            <main className="flex-grow min-w-0 w-full max-w-full overflow-x-hidden">{children}</main>
            <CartDrawer />
            <Footer />
            <FloatingWhatsApp />
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
