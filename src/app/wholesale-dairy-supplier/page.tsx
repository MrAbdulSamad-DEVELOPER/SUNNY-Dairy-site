import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Building2, ShieldCheck, Truck, Phone, MessageSquare, CheckCircle2, Package, Award, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wholesale Dairy Supplier (Milk & Desi Ghee) | SUNNY Dairy Pakistan & Oman',
  description:
    'Commercial wholesale dairy supplier for restaurants, hotels, sweet confectioners & catering in Pakistan and Oman. Bulk pure clarified butter (desi ghee), morning milk, and butter.',
  alternates: {
    canonical: 'https://sunny-dairy-web.vercel.app/wholesale-dairy-supplier',
  },
  openGraph: {
    title: 'Commercial Wholesale Dairy Supplier — SUNNY Dairy',
    description:
      'Bulk pure clarified butter tins, 50L milk canisters, commercial farm butter, and artisanal cottage cheese blocks for B2B hospitality clients across Pakistan and Oman.',
    url: 'https://sunny-dairy-web.vercel.app/wholesale-dairy-supplier',
  },
};

export default function WholesaleSupplierPage() {
  const wholesaleSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SUNNY Dairy Wholesale & Commercial Supply',
    url: 'https://sunny-dairy-web.vercel.app/wholesale-dairy-supplier',
    description:
      'Wholesale supplier of pure clarified butter (desi ghee), farm-fresh raw milk, churned butter, and traditional sweets for restaurants, bakeries, sweet shops, and hospitality groups.',
    telephone: '+96895234002',
    email: 'sanaullah.ccs@gmail.com',
    areaServed: ['Pakistan', 'Oman'],
  };

  return (
    <div className="bg-cream-100 min-h-screen py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wholesaleSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <header className="bg-white rounded-3xl p-6 sm:p-12 border border-cream-200 shadow-sm space-y-6">
          <div className="inline-flex items-center space-x-2 bg-forest-900 text-cream-100 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-gold-400" />
            <span>Commercial B2B &amp; Institutional Supply</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 leading-tight">
            Wholesale Pure Dairy &amp; Clarified Butter Supplier for Pakistan &amp; Oman
          </h1>

          <p className="text-forest-700 text-base sm:text-lg leading-relaxed max-w-3xl">
            Partner with SUNNY Dairy for guaranteed farm purity, uninterrupted volume logistics, and certified batch testing. Supplying luxury hotels, high-end sweet confectioners, bakeries, and fine dining restaurants across Pakistan and Oman.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/96895234002?text=Hello%20SUNNY%20Dairy!%20I%20am%20inquiring%20about%20wholesale%20commercial%20dairy%20supply."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md transition-all space-x-2 text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Wholesale Desk (+968 9523 4002)</span>
            </a>
            <a
              href="tel:+923449322930"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-forest-900 hover:bg-forest-800 text-cream-100 font-bold rounded-2xl shadow-md transition-all space-x-2 text-center"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Direct Farm Call (+92 344 9322930)</span>
            </a>
          </div>
        </header>

        {/* Commercial Products Portfolio */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              Commercial Packaging
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900">
              Bulk Dairy Products for Food Service &amp; Confectionery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-gold-700">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-900">
                Pure Clarified Butter (Artisanal Ghee) — Bulk Tins
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                Available in 5kg, 10kg, and 16kg hermetically sealed commercial food-grade tins. Ideal for commercial sweet manufacturing, Biryani catering, and luxury restaurant sautés. 250°C smoke point with rich caramelized aroma.
              </p>
              <ul className="text-xs text-forest-600 space-y-1.5 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% pure butterfat; 0% vegetable oils</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>12-month ambient shelf life</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-900">
                Morning Farm-Fresh Whole Milk — 50L Canisters
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                Chilled immediately below 4°C at dawn and delivered in sanitized stainless steel or food-grade 50-liter canisters. Guaranteed Zero Water Dilution for tea houses, coffee bars, and commercial milk kitchens.
              </p>
              <ul className="text-xs text-forest-600 space-y-1.5 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Daily morning delivery before 7:30 AM</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Daily lactometer purity certification</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-900">
                Pure Churned Farm Butter &amp; Cottage Cheese
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                Fresh cultured cream butter in 5kg catering blocks and unsalted whole-milk artisanal cottage cheese (paneer) blocks for fine dining curries, grilling, and gourmet bakeries.
              </p>
              <ul className="text-xs text-forest-600 space-y-1.5 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero preservatives or artificial coagulants</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fresh daily preparation on contract</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-700">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-900">
                Corporate Gift Boxes &amp; Wedding Confectionery
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                Custom luxury boxes of traditional cardamom milk fudge, caramelized milk rounds, and granular milk cake prepared exclusively from pure condensed milk solids. Custom corporate branding available.
              </p>
              <ul className="text-xs text-forest-600 space-y-1.5 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Export-grade packaging for Oman &amp; Pakistan</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Volume discounts on 25+ boxes</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Wholesale Inquiry Form */}
        <section className="bg-white rounded-3xl p-6 sm:p-12 border border-cream-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900">
              Submit a Wholesale Inquiry
            </h2>
            <p className="text-sm text-forest-600">
              Fill in your commercial requirements below or connect directly with our Master Dairy Farm Manager, Sanaullah.
            </p>
          </div>

          <form
            action="https://wa.me/96895234002"
            method="GET"
            target="_blank"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
          >
            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Business / Restaurant Name
              </label>
              <input
                type="text"
                name="business"
                required
                placeholder="e.g. Royal Confectioners / Serena Hotel"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm text-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Location (City &amp; Country)
              </label>
              <input
                type="text"
                name="city"
                required
                placeholder="e.g. Muscat, Oman / Islamabad, Pakistan"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm text-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Products of Interest
              </label>
              <select
                name="product"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm text-forest-900 bg-white"
              >
                <option value="Clarified Butter (Desi Ghee) Bulk Tins">Clarified Butter (Desi Ghee) Bulk Tins (5kg–16kg)</option>
                <option value="Fresh Morning Milk (50L Canisters)">Fresh Morning Milk (50L Canisters)</option>
                <option value="Churned Farm Butter (5kg Blocks)">Churned Farm Butter (5kg Blocks)</option>
                <option value="Cottage Cheese (Paneer) Bulk Blocks">Cottage Cheese (Paneer) Bulk Blocks</option>
                <option value="Corporate Gift Boxes Traditional Sweets">Corporate Gift Boxes Traditional Sweets</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Estimated Monthly Volume
              </label>
              <input
                type="text"
                name="volume"
                placeholder="e.g. 50kg Ghee / 200L Milk Daily"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm text-forest-900"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-forest-900 hover:bg-forest-800 text-cream-100 font-bold rounded-2xl shadow-md transition-all space-x-2"
              >
                <span>Submit Commercial Request via WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
