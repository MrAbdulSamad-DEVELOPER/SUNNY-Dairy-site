import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CITIES_DATA } from '@/data/locations';
import { MapPin, Truck, ShieldCheck, ArrowRight, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dairy Delivery Locations in Pakistan & Oman | SUNNY Dairy',
  description:
    'Find SUNNY Dairy delivery coverage across Pakistan (Dera Ismail Khan, Islamabad, Rawalpindi, Lahore, Karachi, Peshawar) and the Sultanate of Oman (Muscat, Salalah, Sohar, Nizwa).',
  alternates: {
    canonical: 'https://sunny-dairy-web.vercel.app/locations',
  },
  openGraph: {
    title: 'SUNNY Dairy Delivery Coverage — Pakistan & Oman',
    description:
      'Farm-fresh raw milk, churned farm butter, pure clarified butter (desi ghee), and traditional sweets delivered to your city.',
    url: 'https://sunny-dairy-web.vercel.app/locations',
  },
};

export default function LocationsIndexPage() {
  const pakistanCities = CITIES_DATA.filter((c) => c.country === 'Pakistan');
  const omanCities = CITIES_DATA.filter((c) => c.country === 'Oman');

  return (
    <div className="bg-cream-100 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-forest-900/10 text-forest-800 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
            <Globe className="w-3.5 h-3.5 text-gold-600" />
            <span>Delivery Network Across Two Nations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 tracking-tight">
            Our Delivery Locations
          </h1>
          <p className="text-forest-700 text-sm sm:text-base leading-relaxed">
            Delivering 100% pure, unadulterated farm milk, artisanal clarified butter, and handcrafted sweets directly to households across Pakistan and the Sultanate of Oman.
          </p>
        </div>

        {/* Pakistan Hub */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 border-b border-cream-300 pb-3">
            <span className="text-2xl">🇵🇰</span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              Pakistan (Local &amp; Express Nationwide Delivery)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pakistanCities.map((city) => (
              <div
                key={city.slug}
                className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
                      {city.country}
                    </span>
                    <span className="text-[11px] font-mono bg-cream-100 text-forest-700 px-2.5 py-0.5 rounded-full">
                      {city.cityName === 'Dera Ismail Khan' ? 'Daily Morning Delivery' : '24-48h Express'}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-forest-900">
                    <Link href={`/locations/${city.slug}`} className="hover:text-gold-700 transition-colors">
                      {city.cityName}
                    </Link>
                  </h3>
                  <p className="text-xs text-forest-600 leading-relaxed line-clamp-2">
                    {city.metaDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
                  <span className="text-forest-500 flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-forest-600" />
                    <span>Doorstep Courier</span>
                  </span>
                  <Link
                    href={`/locations/${city.slug}`}
                    className="font-bold text-gold-700 hover:text-gold-800 transition-colors inline-flex items-center space-x-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Oman Hub */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center space-x-3 border-b border-cream-300 pb-3">
            <span className="text-2xl">🇴🇲</span>
            <h2 className="font-serif text-2xl font-bold text-forest-900">
              Sultanate of Oman (International Air Express &amp; Wholesale)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {omanCities.map((city) => (
              <div
                key={city.slug}
                className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
                      Sultanate of Oman
                    </span>
                    <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Direct Shipping
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-forest-900">
                    <Link href={`/locations/${city.slug}`} className="hover:text-gold-700 transition-colors">
                      {city.cityName}
                    </Link>
                  </h3>
                  <p className="text-xs text-forest-600 leading-relaxed line-clamp-2">
                    {city.metaDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
                  <span className="text-forest-500">Air Cargo / Courier</span>
                  <Link
                    href={`/locations/${city.slug}`}
                    className="font-bold text-gold-700 hover:text-gold-800 transition-colors inline-flex items-center space-x-1"
                  >
                    <span>View City</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Banner */}
        <div className="bg-forest-900 text-cream-100 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-gold-400 mx-auto" />
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Don’t See Your City Listed?
          </h3>
          <p className="text-forest-200 text-sm sm:text-base max-w-xl mx-auto">
            We ship pure clarified butter and traditional sweets gift boxes to any address across Pakistan and Oman. Contact our direct concierge on WhatsApp for a custom shipping quote.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/96895234002?text=Hello%20SUNNY%20Dairy!%20I%20am%20inquiring%20about%20delivery%20to%20my%20city."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold rounded-2xl shadow-md transition-all"
            >
              Inquire on WhatsApp (+968 9523 4002)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
