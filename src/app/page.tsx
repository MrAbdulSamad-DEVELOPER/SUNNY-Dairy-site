import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ProductDTO } from '@/types';
import ShopCatalog from '@/components/product/ShopCatalog';
import TrustBanner from '@/components/ui/TrustBanner';
import DailySubscriptionBanner from '@/components/ui/DailySubscriptionBanner';
import FaqSection from '@/components/ui/FaqSection';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { OFFICIAL_STORE_NAME, OFFICIAL_STORE_OWNER, OFFICIAL_PHONE_NUMBER } from '@/lib/whatsapp';

const SITE_URL = 'https://sunny-dairy-web.vercel.app';

export const metadata = {
  title: `${OFFICIAL_STORE_NAME} — Pure Farm Milk, Butter & Desi Ghee Dera Ismail Khan`,
  description:
    'Fresh cow milk, pure goat milk, natural yogurt, artisanal butter, slow-simmered desi ghee, and traditional sweets delivered daily across Dera Ismail Khan by Sanaullah.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${OFFICIAL_STORE_NAME} — Farm Fresh Milk & Dairy Dera Ismail Khan`,
    description:
      'Pure morning milk, farm-fresh butter, traditional slow-simmered desi ghee, and authentic sweets delivered across Dera Ismail Khan. Cash on delivery available.',
    url: SITE_URL,
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProducts(): Promise<ProductDTO[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        category: true,
        variants: {
          orderBy: { size: 'asc' },
        },
      },
    });

    return JSON.parse(JSON.stringify(products));
  } catch (e) {
    console.error('Failed to load products for homepage', e);
    return [];
  }
}

export default async function HomePage() {
  const [products, cmsSections, siteSettings] = await Promise.all([
    getProducts(),
    prisma.cmsSection.findMany().catch(() => []),
    prisma.siteSetting.findMany().catch(() => []),
  ]);

  const cmsMap: Record<string, any> = {};
  cmsSections.forEach((s) => {
    cmsMap[s.sectionKey] = s;
  });

  const settingsMap: Record<string, string> = {};
  siteSettings.forEach((s) => {
    settingsMap[s.settingKey] = s.settingValue;
  });

  const heroSubtitle = cmsMap.hero?.subtitle || 'Pure Milk, Butter & Desi Ghee';
  const heroTitle = cmsMap.hero?.title || 'Fresh milk. Straight from the farm.';
  const heroContent =
    cmsMap.hero?.content ||
    'Collected each morning at dawn, chilled below 4°C and delivered to your doorstep across Dera Ismail Khan and all over Pakistan. Order in a minute, pay when it arrives.';
  const heroImageUrl = cmsMap.hero?.imageUrl || '/products/hero-farm.jpg';
  const heroButtonText = cmsMap.hero?.buttonText || 'Shop Now';
  const heroButtonLink = cmsMap.hero?.buttonLink || '#shop-catalog';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is there any water dilution or chemicals added to the milk?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely not. SUNNY Dairy strictly adheres to a Zero Water Dilution policy. Every morning after milking, fat content and purity are verified using lactometers and testing kits. We never add water, preservatives, chemicals, or milk powder.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the milk raw or boiled?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our milk is 100% natural, fresh raw whole milk chilled immediately after milking to below 4°C in food-grade stainless steel chillers. Once delivered to your home, simply boil it following normal kitchen practice. When boiled, you will notice a thick, rich layer of natural clotted cream.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I place an order and what are the delivery hours?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can easily place an order through our website by adding products to your cart, or message us directly via WhatsApp. Morning deliveries take place between 7:00 AM and 11:30 AM across all major areas of Dera Ismail Khan (Cantt, Circular Road, Bannu Road, Mandra, and surrounding areas).',
        },
      },
      {
        '@type': 'Question',
        name: 'What payment methods are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our most popular option is Cash on Delivery (COD) — inspect your fresh dairy at your doorstep upon delivery and pay the rider directly. We also accept advance direct bank transfers via UBL.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I set up a daily or monthly milk subscription?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can subscribe for daily delivery of 1 Liter, 2 Liters, 5 Liters, or more. If you ever need to pause delivery or adjust your order quantity, simply notify us via WhatsApp with a single message to adjust your routine.',
        },
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((prod, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: prod.name,
        description: prod.description || `Pure ${prod.name} from SUNNY Dairy farm Dera Ismail Khan`,
        image: prod.imageUrl ? `${SITE_URL}${prod.imageUrl}` : `${SITE_URL}/nev-logo.png`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'PKR',
          price: prod.variants?.[0]?.price || '300',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <div className="space-y-10 sm:space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-10 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100/80 border border-gold-300/80 text-gold-800 text-[11px] sm:text-xs font-bold tracking-wide uppercase shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-600 animate-pulse" />
              <span>{heroSubtitle}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-forest-800 leading-[1.18] sm:leading-[1.12]">
              {heroTitle}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-muted max-w-xl leading-relaxed">
              {heroContent}
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex items-center gap-3 pt-1 sm:pt-2">
              <a
                href={heroButtonLink}
                className="flex-1 sm:flex-initial px-6 sm:px-8 py-3 sm:py-3.5 bg-forest-800 hover:bg-forest-900 text-white rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-center"
              >
                {heroButtonText}
              </a>
              <Link
                href="/our-promise"
                className="flex-1 sm:flex-initial px-6 sm:px-8 py-3 sm:py-3.5 bg-transparent hover:bg-cream-200/80 text-forest-800 border border-forest-800/40 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95 text-center"
              >
                Our Promise
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-2 sm:pt-4 grid grid-cols-1 sm:flex sm:flex-wrap gap-2 sm:gap-6 text-xs text-forest-800/85 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>Zero water adulteration</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>Daily morning milking</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>Cold-chain delivery</span>
              </span>
            </div>
          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-5 pt-2 sm:pt-0">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white/90 aspect-[16/10] sm:aspect-[5/4] lg:aspect-[4/3] w-full">
              <Image
                src={heroImageUrl || '/products/hero-farm.jpg'}
                alt="SUNNY Dairy farm fresh milk bottles"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Benefits Banner */}
      <TrustBanner />

      {/* The Shop Catalog Section */}
      <ShopCatalog initialProducts={products} />

      {/* Daily Milk Subscription Feature */}
      <DailySubscriptionBanner />

      {/* How Ordering Works Section */}
      <section className="bg-[#FAF3E4] py-16 border-y border-borderCream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              Simple & Honest
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
              How ordering works with {OFFICIAL_STORE_NAME}
            </h2>
            <p className="text-sm text-muted">
              We operate on true farm cycles. You get yesterday&apos;s evening and today&apos;s early morning batch fresh without factory processing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-borderCream/60 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-800">Choose Products</h3>
              <p className="text-xs text-muted leading-relaxed">
                Browse our fresh cow milk, goat milk, pure butter, ghee, and traditional sweets. Select your preferred sizes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-borderCream/60 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-800">Instant Basket</h3>
              <p className="text-xs text-muted leading-relaxed">
                Add to Basket and enter your delivery city, address, and contact number for fast dispatch.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-borderCream/60 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-800">WhatsApp Confirmation</h3>
              <p className="text-xs text-muted leading-relaxed">
                We review batch availability and confirm any pending prices directly on WhatsApp before dispatch.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-borderCream/60 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-base">
                4
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-800">Chilled Doorstep Delivery</h3>
              <p className="text-xs text-muted leading-relaxed">
                Our temperature-controlled rider delivers to your doorstep. Inspect your fresh dairy and pay cash on delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Our Promise Feature Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-forest-800 text-cream-50 rounded-3xl p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Our Farm Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Pure milk is non-negotiable. <br />
              No chemicals, no powders, no shortcuts.
            </h2>
            <p className="text-forest-200 text-sm sm:text-base leading-relaxed max-w-2xl">
              Unlike commercial industrial brands that reconstitute powdered milk or add synthetic thickeners, {OFFICIAL_STORE_NAME} comes straight from healthy, grass-fed cattle managed personally by {OFFICIAL_STORE_OWNER}.
            </p>
            <div className="pt-2">
              <Link
                href="/our-promise"
                className="inline-flex items-center space-x-2 btn-gold-shimmer px-6 py-3 rounded-xl text-sm transition-all"
              >
                <span>Read Our Full Quality Standard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 bg-forest-900/60 p-6 rounded-2xl border border-forest-700/60 space-y-4">
            <h4 className="font-serif text-lg font-bold text-gold-300">Quick Delivery Stats</h4>
            <div className="space-y-3 text-xs text-forest-100">
              <div className="flex justify-between border-b border-forest-800 pb-2">
                <span>Morning Milking:</span>
                <span className="font-bold text-white">4:30 AM – 6:30 AM</span>
              </div>
              <div className="flex justify-between border-b border-forest-800 pb-2">
                <span>Chilling Temperature:</span>
                <span className="font-bold text-white">Below 4°C</span>
              </div>
              <div className="flex justify-between border-b border-forest-800 pb-2">
                <span>Doorstep Window:</span>
                <span className="font-bold text-white">7:00 AM – 11:30 AM</span>
              </div>
              <div className="flex justify-between border-b border-forest-800 pb-2">
                <span>Direct Contact:</span>
                <span className="font-bold text-gold-400">{OFFICIAL_PHONE_NUMBER}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="font-bold text-gold-400">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
