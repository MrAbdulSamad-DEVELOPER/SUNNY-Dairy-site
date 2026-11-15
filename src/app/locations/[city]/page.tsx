import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CITIES_DATA, CityLocation } from '@/data/locations';
import { getLocalBusinessSchema, getFaqSchema, getBreadcrumbSchema } from '@/lib/seo/schema';
import { MapPin, Truck, ShieldCheck, CheckCircle2, Phone, MessageSquare, ChevronRight, HelpCircle } from 'lucide-react';

interface CityPageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateStaticParams() {
  return CITIES_DATA.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = CITIES_DATA.find((c) => c.slug === citySlug);

  if (!city) {
    return {
      title: 'Location Not Found | SUNNY Dairy',
    };
  }

  const url = `https://sunny-dairy-web.vercel.app/locations/${city.slug}`;

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url: url,
      type: 'website',
      images: [
        {
          url: 'https://sunny-dairy-web.vercel.app/nev-logo.png',
          width: 1200,
          height: 630,
          alt: `SUNNY Dairy Delivery in ${city.cityName}`,
        },
      ],
    },
  };
}

export default async function CityLocationPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  const city = CITIES_DATA.find((c) => c.slug === citySlug);

  if (!city) {
    notFound();
  }

  const localBusinessSchema = getLocalBusinessSchema(city);
  const faqSchema = getFaqSchema(city.localFaqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: city.cityName, url: `/locations/${city.slug}` },
  ]);

  const whatsappPhone = city.countryCode === 'OM' ? '96895234002' : '96895234002';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=Hello%20SUNNY%20Dairy!%20I%20would%20like%20to%20place%20an%20order%20for%20delivery%20in%20${encodeURIComponent(city.cityName)}.`;

  return (
    <div className="bg-cream-100 min-h-screen py-10 sm:py-16">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-forest-600">
          <Link href="/" className="hover:text-forest-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-forest-400" />
          <Link href="/locations" className="hover:text-forest-900 transition-colors">
            Locations
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-forest-400" />
          <span className="text-forest-900 font-semibold">{city.cityName}</span>
        </nav>

        {/* Hero Section */}
        <header className="bg-white rounded-3xl p-6 sm:p-12 border border-cream-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-forest-900 text-cream-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {city.country === 'Pakistan' ? '🇵🇰 Pakistan' : '🇴🇲 Sultanate of Oman'}
            </span>
            <span className="bg-gold-500/20 text-gold-900 px-3 py-1 rounded-full text-xs font-bold">
              Doorstep Delivery
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 leading-tight">
            {city.h1Title}
          </h1>

          <p className="text-forest-700 text-base sm:text-lg leading-relaxed max-w-3xl">
            {city.heroSubtitle}
          </p>

          <p className="text-forest-800 text-sm sm:text-base leading-relaxed border-t border-cream-200 pt-6">
            {city.leadContent}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
              <span className="text-xs text-forest-600 block">Delivery Timetable</span>
              <strong className="text-sm text-forest-900 block mt-1">{city.deliverySchedule}</strong>
            </div>
            <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
              <span className="text-xs text-forest-600 block">Minimum Order</span>
              <strong className="text-sm text-forest-900 block mt-1">{city.minimumOrder}</strong>
            </div>
            <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
              <span className="text-xs text-forest-600 block">Payment Methods</span>
              <strong className="text-sm text-forest-900 block mt-1">{city.paymentOptions.join(' · ')}</strong>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold rounded-2xl shadow-md transition-all text-center"
            >
              Order Online for {city.cityName}
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md transition-all text-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Order via WhatsApp Desk</span>
            </a>
          </div>
        </header>

        {/* Quality Features */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900">
            Why Households in {city.cityName} Choose SUNNY Dairy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {city.qualityFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-800">
                  <CheckCircle2 className="w-5 h-5 text-gold-600" />
                </div>
                <h3 className="font-serif text-lg font-bold text-forest-900">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Service Areas in the City */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-forest-900">
            <MapPin className="w-5 h-5 text-gold-600" />
            <h2 className="font-serif text-2xl font-bold">
              Neighborhoods &amp; Sectors Served in {city.cityName}
            </h2>
          </div>
          <p className="text-sm text-forest-600">
            Our temperature-safe delivery fleet and courier routes cover the following residential and commercial sectors:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {city.serviceAreas.map((area, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 bg-cream-50 px-3.5 py-2.5 rounded-xl border border-cream-200 text-xs text-forest-800 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Products Available for Delivery */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900">
              Popular Dairy Products in {city.cityName}
            </h2>
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-bold text-gold-700 hover:text-gold-800 transition-colors"
            >
              Browse All Products &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <img src="/products/cow-milk.jpg" alt="Fresh Cow Milk" className="w-full h-36 object-cover rounded-2xl" />
              <h3 className="font-serif font-bold text-base text-forest-900">Fresh Cow Milk</h3>
              <p className="text-xs text-forest-600">Dawn-milked, raw whole milk with thick natural cream.</p>
              <Link href="/product/fresh-cow-milk" className="block text-xs font-bold text-gold-700 hover:underline">
                View Milk Options &rarr;
              </Link>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <img src="/products/desi-ghee.jpg" alt="Pure Clarified Butter" className="w-full h-36 object-cover rounded-2xl" />
              <h3 className="font-serif font-bold text-base text-forest-900">Pure Clarified Butter</h3>
              <p className="text-xs text-forest-600">Artisanal slow-cooked golden ghee in sealed glass jars.</p>
              <Link href="/product/pure-clarified-butter-artisanal-ghee" className="block text-xs font-bold text-gold-700 hover:underline">
                View Ghee Jars &rarr;
              </Link>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <img src="/products/pure-makhan.jpg" alt="Pure Churned Farm Butter" className="w-full h-36 object-cover rounded-2xl" />
              <h3 className="font-serif font-bold text-base text-forest-900">Pure Farm Butter</h3>
              <p className="text-xs text-forest-600">Freshly churned cultured cream butter delivered chilled.</p>
              <Link href="/product/pure-churned-farm-butter" className="block text-xs font-bold text-gold-700 hover:underline">
                View Farm Butter &rarr;
              </Link>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <img src="/products/barfi.jpg" alt="Traditional Milk Sweets" className="w-full h-36 object-cover rounded-2xl" />
              <h3 className="font-serif font-bold text-base text-forest-900">Cardamom Milk Sweets</h3>
              <p className="text-xs text-forest-600">Authentic sweets from 100% condensed milk solids.</p>
              <Link href="/product/traditional-cardamom-milk-fudge" className="block text-xs font-bold text-gold-700 hover:underline">
                View Gift Boxes &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Local FAQs */}
        {city.localFaqs.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-forest-900">
              <HelpCircle className="w-6 h-6 text-gold-600" />
              <h2 className="font-serif text-2xl font-bold">
                {city.cityName} Delivery Questions Answered
              </h2>
            </div>
            <div className="divide-y divide-cream-200">
              {city.localFaqs.map((faq, idx) => (
                <div key={idx} className="py-4 space-y-2 first:pt-0 last:pb-0">
                  <h3 className="font-bold text-base sm:text-lg text-forest-900">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-forest-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
