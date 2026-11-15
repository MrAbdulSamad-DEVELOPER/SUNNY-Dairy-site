import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CITIES_DATA } from '@/data/locations';
import { MapPin, Truck, ShieldCheck, ArrowRight, Globe, Clock, PackageCheck, Sparkles } from 'lucide-react';

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
    <div className="bg-cream-100 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-forest-900/10 text-forest-800 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
            <Globe className="w-3.5 h-3.5 text-gold-600" />
            <span>International &amp; Nationwide Delivery Network</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 tracking-tight">
            Our Delivery Locations
          </h1>
          <p className="text-forest-700 text-sm sm:text-base leading-relaxed">
            Delivering 100% pure, unadulterated farm milk, artisanal clarified butter, and handcrafted sweets directly to households across Pakistan and the Sultanate of Oman.
          </p>
        </div>

        {/* Pakistan Network */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 border-b border-cream-300 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs flex-shrink-0">
              PK
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest-900 leading-tight">
                Pakistan — Farm Direct &amp; Nationwide Delivery
              </h2>
              <p className="text-xs text-forest-600">
                Direct dawn routes in Dera Ismail Khan and temperature-cushioned express courier to all major cities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pakistanCities.map((city) => (
              <div
                key={city.slug}
                className="bg-white rounded-3xl p-6 border border-cream-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5 group hover:border-gold-300"
              >
                <div className="space-y-4">
                  {/* Card Header Pills */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center space-x-1.5 bg-forest-50 text-forest-800 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Pakistan</span>
                    </span>
                    <span className="text-[11px] font-semibold bg-gold-50 text-gold-800 px-2.5 py-1 rounded-full border border-gold-200/60">
                      {city.cityName === 'Dera Ismail Khan' ? 'Daily Morning Delivery' : '24-48h Express'}
                    </span>
                  </div>

                  {/* City Title with Icon */}
                  <div className="flex items-start space-x-3 pt-1">
                    <div className="w-10 h-10 rounded-2xl bg-cream-100 flex items-center justify-center text-forest-800 flex-shrink-0 group-hover:bg-forest-900 group-hover:text-gold-400 transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-forest-900 group-hover:text-gold-700 transition-colors">
                        <Link href={`/locations/${city.slug}`}>
                          {city.cityName}
                        </Link>
                      </h3>
                      <p className="text-xs text-forest-500 font-medium">
                        {city.cityName === 'Dera Ismail Khan' ? 'Direct Farm Headquarters' : 'Express Doorstep Courier'}
                      </p>
                    </div>
                  </div>

                  {/* Schedule Snippet */}
                  <div className="bg-cream-50/70 p-3 rounded-2xl border border-cream-200/60 flex items-center space-x-2.5 text-xs text-forest-800">
                    <Clock className="w-4 h-4 text-gold-600 flex-shrink-0" />
                    <span className="font-medium line-clamp-1">{city.deliverySchedule}</span>
                  </div>

                  {/* Service Areas Preview */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-forest-500 block">
                      Key Delivery Sectors:
                    </span>
                    <p className="text-xs text-forest-700 leading-relaxed line-clamp-2">
                      {city.serviceAreas.slice(0, 4).join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-4 border-t border-cream-200/80">
                  <Link
                    href={`/locations/${city.slug}`}
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-forest-900 hover:bg-forest-800 text-cream-100 transition-all duration-200 shadow-xs group-hover:bg-gold-500 group-hover:text-forest-950"
                  >
                    <span>View {city.cityName} Delivery Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sultanate of Oman Network */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center space-x-3 border-b border-cream-300 pb-4">
            <div className="w-9 h-9 rounded-xl bg-red-800 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs flex-shrink-0">
              OM
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest-900 leading-tight">
                Sultanate of Oman — International Air Cargo &amp; Wholesale
              </h2>
              <p className="text-xs text-forest-600">
                Artisanal clarified butter (desi ghee), farm butter, and traditional confectionery shipped directly to residential compounds and luxury catering.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {omanCities.map((city) => (
              <div
                key={city.slug}
                className="bg-white rounded-3xl p-6 border border-cream-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5 group hover:border-gold-300"
              >
                <div className="space-y-4">
                  {/* Card Header Pills */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center space-x-1.5 bg-red-50 text-red-900 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-red-200/60">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      <span>Sultanate of Oman</span>
                    </span>
                    <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200/60">
                      Direct Shipping
                    </span>
                  </div>

                  {/* City Title with Icon */}
                  <div className="flex items-start space-x-3 pt-1">
                    <div className="w-10 h-10 rounded-2xl bg-cream-100 flex items-center justify-center text-forest-800 flex-shrink-0 group-hover:bg-forest-900 group-hover:text-gold-400 transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-forest-900 group-hover:text-gold-700 transition-colors">
                        <Link href={`/locations/${city.slug}`}>
                          {city.cityName}
                        </Link>
                      </h3>
                      <p className="text-xs text-forest-500 font-medium">
                        Express Air Courier &amp; Freight
                      </p>
                    </div>
                  </div>

                  {/* Schedule Snippet */}
                  <div className="bg-cream-50/70 p-3 rounded-2xl border border-cream-200/60 flex items-center space-x-2.5 text-xs text-forest-800">
                    <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium line-clamp-1">{city.deliverySchedule}</span>
                  </div>

                  {/* Service Areas Preview */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-forest-500 block">
                      Governorate Sectors:
                    </span>
                    <p className="text-xs text-forest-700 leading-relaxed line-clamp-2">
                      {city.serviceAreas.slice(0, 4).join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-4 border-t border-cream-200/80">
                  <Link
                    href={`/locations/${city.slug}`}
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-forest-900 hover:bg-forest-800 text-cream-100 transition-all duration-200 shadow-xs group-hover:bg-gold-500 group-hover:text-forest-950"
                  >
                    <span>View {city.cityName} Delivery Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Banner */}
        <div className="bg-forest-900 text-cream-100 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <ShieldCheck className="w-12 h-12 text-gold-400 mx-auto" />
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Need Custom Shipping to Another City?
          </h3>
          <p className="text-forest-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            We ship pure clarified butter jars and traditional sweets gift boxes to any residential address or commercial venue across Pakistan and Oman. Contact our concierge for personalized arrangements.
          </p>
          <div className="pt-3">
            <a
              href="https://wa.me/96895234002?text=Hello%20SUNNY%20Dairy!%20I%20am%20inquiring%20about%20delivery%20to%20my%20city."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold rounded-2xl shadow-md transition-all text-sm"
            >
              Inquire on WhatsApp (+968 9523 4002)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
