import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Heart, Sparkles, Flame, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Health Benefits of Pure Clarified Butter (Desi Ghee) | SUNNY Dairy',
  description:
    'Scientific health benefits of pure artisanal clarified butter (desi ghee): high smoke point, gut-healing butyric acid, fat-soluble vitamins A, D, E & K2, and cardiovascular wellness in Pakistan and Oman.',
  alternates: {
    canonical: 'https://sunny-dairy-web.vercel.app/health-benefits-of-pure-desi-ghee',
  },
  openGraph: {
    title: 'The Proven Health Benefits of Pure Artisanal Clarified Butter (Desi Ghee)',
    description:
      'Learn why traditional slow-simmered clarified butter is one of nature’s most stable, nutritious, and healing culinary fats.',
    url: 'https://sunny-dairy-web.vercel.app/health-benefits-of-pure-desi-ghee',
  },
};

export default function HealthBenefitsDesiGheePage() {
  const gheeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Science-Backed Health Benefits of Pure Clarified Butter (Desi Ghee)',
    description:
      'A comprehensive nutritional analysis of pure clarified butter, its cellular benefits, lipid stability, and role in human longevity.',
    author: {
      '@type': 'Person',
      name: 'Sanaullah',
      jobTitle: 'Master Dairy Farm Manager',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SUNNY Dairy',
    },
    mainEntityOfPage: 'https://sunny-dairy-web.vercel.app/health-benefits-of-pure-desi-ghee',
  };

  return (
    <div className="bg-cream-100 min-h-screen py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gheeSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <header className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gold-500/20 text-gold-900 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-700" />
            <span>Nutritional Longevity &amp; Science</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 leading-tight">
            The Complete Health Benefits of Pure Artisanal Clarified Butter (Desi Ghee)
          </h1>

          <p className="text-forest-700 text-sm sm:text-base leading-relaxed">
            Why centuries of traditional culinary wisdom and modern lipid biochemistry agree: pure slow-cooked clarified butter is essential for vitality, hormonal balance, and cellular health.
          </p>
        </header>

        {/* Lead Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm space-y-4 text-forest-800 leading-relaxed text-sm sm:text-base">
          <p>
            For generations across the fertile plains of the Indus River and the ancient trade ports of Oman, pure clarified butter (celebrated traditionally as <strong>Desi Ghee</strong>) was treasured not merely as a cooking medium, but as an indispensable restorative medicine. In classical Ayurvedic and Unani traditions, it was hailed as a <em>Rasayana</em>—a premier substance that rejuvenates the body and sharpens mental clarity.
          </p>
          <p>
            Today, nutritional biochemistry confirms what our ancestors understood intuitively: clarified butter produced by the slow, continuous simmer of cultured whole-milk butter possesses an extraordinary concentration of bioactive fatty acids and fat-soluble vitamins virtually absent in industrial seed oils.
          </p>
        </div>

        {/* 6 Key Benefits */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900">
            6 Proven Health Advantages of Pure Clarified Butter
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Flame className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">
                1. High Smoke Point (250°C / 482°F)
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                Because milk solids and water have been entirely separated during artisanal simmering, clarified butter does not burn or oxidize under intense cooking temperatures. Unlike delicate polyunsaturated oils that generate toxic aldehydes when heated, clarified butter preserves the cellular integrity of your food.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">
                2. Natural Butyric Acid for Gut Healing
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                Clarified butter is one of nature’s richest dietary sources of butyrate—a short-chain fatty acid that serves as the primary fuel source for cells lining your colon. Butyrate supports mucosal healing, calms gut inflammation, and combats leaky gut syndrome.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-800">
                <CheckCircle2 className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">
                3. Fat-Soluble Vitamins A, D, E &amp; K2
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                Grass-fed dairy fats carry bioavailable Vitamin K2 (menaquinone-7), which activates osteocalcin to direct calcium out of arterial blood vessels and directly into bone matrices, safeguarding arterial elasticity while bolstering bone density.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-800">
                <CheckCircle2 className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">
                4. Zero Lactose &amp; Zero Casein
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                During the slow-reduction process, milk proteins (casein) and milk sugars (lactose) precipitate to the bottom of the cauldron as caramelized sediment and are thoroughly filtered out. The final golden liquid is 100% pure butterfat, easily digested by lactose-sensitive individuals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-800">
                <CheckCircle2 className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">
                5. Conjugated Linoleic Acid (CLA) for Metabolism
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                Natural CLA in pure clarified butter has been shown in human metabolic trials to aid in reducing abdominal visceral adipose tissue while preserving lean muscle mass and improving insulin sensitivity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-800">
                <CheckCircle2 className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">
                6. Enhanced Nutrient Bio-Absorption
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                Vitamins and phytochemicals in vegetables (like beta-carotene in carrots, lycopene in tomatoes, and curcumin in turmeric) are lipophilic, requiring healthy dietary fats for intestinal assimilation. Cooking spices in clarified butter increases their bioavailability by up to 300%.
              </p>
            </div>
          </div>
        </section>

        {/* Quality Standard */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-forest-900">
            How SUNNY Dairy Clarified Butter is Prepared
          </h2>
          <p className="text-sm sm:text-base text-forest-800 leading-relaxed">
            Unlike commercial cooking oils extracted via chemical solvent baths or industrial ghee formulated from cheap palm stearin, SUNNY Dairy clarified butter starts with pure morning milk collected from our own monitored herd. The milk is naturally cultured, churned into fresh farm butter, and gently simmered over low embers in small batches.
          </p>
          <p className="text-sm sm:text-base text-forest-800 leading-relaxed">
            The finished product is packed warm into airtight glass jars, allowing it to cool slowly into its signature golden granular (<em>danedaar</em>) texture without artificial stabilizers or synthetic aromas.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="bg-forest-900 text-cream-100 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-gold-400 mx-auto" />
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Bring Pure Artisanal Clarified Butter to Your Kitchen
          </h3>
          <p className="text-forest-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Airtight glass jars available in 250g, 500g, 1kg, and 5kg bulk tins. Shipped directly across Pakistan.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/product/pure-clarified-butter-artisanal-ghee"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold rounded-2xl shadow-md transition-all"
            >
              Order Clarified Butter Jar
            </Link>
            <a
              href="https://wa.me/96895234002?text=Hello%20SUNNY%20Dairy!%20I%20would%20like%20to%20order%20pure%20clarified%20butter%20(desi%20ghee)."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all"
            >
              Order via WhatsApp (+968 9523 4002)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
