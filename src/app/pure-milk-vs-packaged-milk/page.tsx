import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, CheckCircle2, XCircle, ArrowRight, Milk, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Farm-Fresh Raw Milk vs. Packaged Tetra Milk | SUNNY Dairy',
  description:
    'Detailed nutritional and safety comparison between dawn-milked farm fresh whole milk and industrial UHT ultra-pasteurized shelf-stable milk in Pakistan and Oman.',
  alternates: {
    canonical: 'https://sunny-dairy-web.vercel.app/pure-milk-vs-packaged-milk',
  },
  openGraph: {
    title: 'Farm-Fresh Milk vs Packaged Milk: The Definitive Comparison',
    description:
      'Discover why unadulterated whole milk chilled below 4°C provides superior bioavailable calcium, intact enzymes, and rich natural cream over shelf-stable industrial milk.',
    url: 'https://sunny-dairy-web.vercel.app/pure-milk-vs-packaged-milk',
  },
};

export default function PureMilkVsPackagedMilkPage() {
  const comparisonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Farm-Fresh Raw Whole Milk vs. Packaged Tetra Pack Milk: Complete Comparison Guide',
    description:
      'Nutritional analysis comparing unadulterated farm fresh whole milk with ultra-high-temperature processed shelf-stable carton milk.',
    author: {
      '@type': 'Person',
      name: 'Sanaullah',
      jobTitle: 'Master Dairy Farm Manager',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SUNNY Dairy',
    },
    mainEntityOfPage: 'https://sunny-dairy-web.vercel.app/pure-milk-vs-packaged-milk',
  };

  return (
    <div className="bg-cream-100 min-h-screen py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <header className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gold-500/20 text-gold-900 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Milk className="w-3.5 h-3.5 text-gold-700" />
            <span>Nutritional Comparison &amp; Buyer’s Guide</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 leading-tight">
            Farm-Fresh Raw Whole Milk vs. Packaged Tetra Milk: Which is Truly Healthier?
          </h1>

          <p className="text-forest-700 text-sm sm:text-base leading-relaxed">
            An in-depth nutritional and biochemical comparison between dawn-collected whole milk chilled below 4°C and industrial ultra-high temperature (UHT) shelf-stable carton milk.
          </p>
        </header>

        {/* Introduction */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm space-y-4 text-forest-800 leading-relaxed text-sm sm:text-base">
          <p>
            For decades, urban families across Pakistan and Oman have grappled with a crucial nutrition dilemma: should they purchase convenience-driven packaged carton milk from supermarket aisles, or source fresh whole milk directly from a trusted pastoral dairy farm?
          </p>
          <p>
            While ultra-pasteurized packaged milk boasts long ambient shelf lives, that convenience comes at a steep nutritional cost. Industrial heat processing alters delicate dairy proteins, destroys living digestive enzymes, and homogenizes butterfat into unnatural microscopic droplets. Let us look beneath the marketing claims and examine the molecular reality.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-forest-900">
            Head-to-Head Nutritional Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-cream-200 rounded-2xl overflow-hidden">
              <thead className="bg-forest-900 text-cream-100">
                <tr>
                  <th className="p-3.5">Key Attribute</th>
                  <th className="p-3.5 text-gold-300">SUNNY Farm-Fresh Whole Milk</th>
                  <th className="p-3.5">Commercial Packaged Tetra Milk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 text-forest-800">
                <tr>
                  <td className="p-3.5 font-bold">Processing Method</td>
                  <td className="p-3.5 text-emerald-800 font-semibold bg-emerald-50/50">
                    Chilled below 4°C at dawn, zero artificial processing
                  </td>
                  <td className="p-3.5 text-forest-600">
                    UHT heated to 135°C–150°C under high pressure
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Natural Cream Layer</td>
                  <td className="p-3.5 text-emerald-800 font-semibold bg-emerald-50/50">
                    Thick, golden clotted cream floats when gently boiled
                  </td>
                  <td className="p-3.5 text-forest-600">
                    Mechanically homogenized; natural cream is pulverized
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Digestive Enzymes</td>
                  <td className="p-3.5 text-emerald-800 font-semibold bg-emerald-50/50">
                    Intact lactase, lipase &amp; alkaline phosphatase
                  </td>
                  <td className="p-3.5 text-forest-600">
                    Denatured and destroyed by extreme heat sterilization
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Bioactive Immunoglobulins</td>
                  <td className="p-3.5 text-emerald-800 font-semibold bg-emerald-50/50">
                    Active immune factors and natural lactoferrin
                  </td>
                  <td className="p-3.5 text-forest-600">
                    Neutralized by UHT thermal denaturation
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Water Dilution Policy</td>
                  <td className="p-3.5 text-emerald-800 font-semibold bg-emerald-50/50">
                    Strict Zero Water Dilution Guarantee (Lactometer tested)
                  </td>
                  <td className="p-3.5 text-forest-600">
                    Often reconstituted from milk powder and water
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Shelf Life &amp; Storage</td>
                  <td className="p-3.5 text-emerald-800 font-semibold bg-emerald-50/50">
                    Fresh daily morning delivery; keep refrigerated
                  </td>
                  <td className="p-3.5 text-forest-600">
                    3 to 6 months at room temperature in cardboard
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Nutritional Pillars */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900">
            Why Farm-Fresh Whole Milk Is Superior for Growing Children &amp; Adults
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-800">
                <CheckCircle2 className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">
                Intact Casein &amp; Whey Protein Structures
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                When whole milk is subjected to UHT processing, whey proteins unfold and bind irreversibly to kappa-casein micelles. This heat-induced Maillard reaction impairs proteolytic enzyme breakdown in human stomachs, frequently triggering digestive bloating and discomfort. Fresh milk maintains its pristine native protein structure.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-800">
                <CheckCircle2 className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">
                Natural Butterfat Globule Membranes (MFGM)
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                The Milk Fat Globule Membrane (MFGM) surrounding fat droplets in fresh milk is rich in complex phospholipids and sphingolipids essential for infant cognitive development and adult gut barrier integrity. Homogenization destroys this delicate protective membrane.
              </p>
            </div>
          </div>
        </section>

        {/* Ordering CTA */}
        <div className="bg-forest-900 text-cream-100 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-gold-400 mx-auto" />
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Switch Your Family to 100% Pure Morning Farm Milk
          </h3>
          <p className="text-forest-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Delivered fresh each morning between 7:00 AM and 8:30 AM across Dera Ismail Khan, and express cold-chain delivery to regional centers.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold rounded-2xl shadow-md transition-all"
            >
              Order Fresh Milk Now
            </Link>
            <a
              href="https://wa.me/96895234002?text=Hello%20SUNNY%20Dairy!%20I%20want%20to%20subscribe%20to%20daily%20fresh%20farm%20milk."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all"
            >
              WhatsApp Delivery Desk (+968 9523 4002)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
