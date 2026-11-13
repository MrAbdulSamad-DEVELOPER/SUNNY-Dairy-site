import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ProductDTO } from '@/types';
import ShopCatalog from '@/components/product/ShopCatalog';
import TrustBanner from '@/components/ui/TrustBanner';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { OFFICIAL_STORE_NAME, OFFICIAL_STORE_OWNER, OFFICIAL_PHONE_NUMBER } from '@/lib/whatsapp';

export const revalidate = 60; // Revalidate every minute

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
  const products = await getProducts();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-gold-700 uppercase bg-gold-100/60 px-3 py-1 rounded-full border border-gold-200">
                PURE MILK, MAKHAN & GHEE · ALL OVER PAKISTAN
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-forest-800 leading-[1.12]">
              Fresh milk. <br />
              <span className="text-forest-700">Straight from</span> the farm.
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              Collected each morning at dawn, chilled below 4°C and delivered to your doorstep across Dera Ismail Khan and all over Pakistan. Order in a minute, pay when it arrives.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#shop-catalog"
                className="px-8 py-3.5 bg-forest-800 hover:bg-forest-900 text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                Shop Now
              </a>
              <Link
                href="/our-promise"
                className="px-8 py-3.5 bg-transparent hover:bg-cream-200/80 text-forest-800 border border-forest-800/40 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 active:scale-95"
              >
                Our Promise
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex flex-wrap gap-6 text-xs text-muted font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                <span>Zero water adulteration</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                <span>Daily morning milking</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                <span>Cold-chain delivery</span>
              </span>
            </div>
          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] w-full">
              <Image
                src="/products/hero-farm.jpg"
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
                Browse our fresh cow milk, goat milk, pure makhan, ghee, and traditional sweets. Select your preferred sizes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-borderCream/60 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-800">Instant Basket</h3>
              <p className="text-xs text-muted leading-relaxed">
                Add to cart and enter your Pakistan delivery city, address, and contact number for fast dispatch.
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
                className="inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
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
