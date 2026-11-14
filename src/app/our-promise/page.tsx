import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Heart, Droplets, Snowflake, Sparkles, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_STORE_NAME, OFFICIAL_STORE_OWNER } from '@/lib/whatsapp';

export const metadata = {
  title: `Our Promise — Pure Farm Milk & Authentic Heritage — ${OFFICIAL_STORE_NAME}`,
  description:
    'Our dairy standards: zero dilution, no artificial hormones, cold-chain chilling below 4°C, and traditional churned butter and ghee.',
};

export default function OurPromisePage() {
  const standards = [
    {
      icon: Droplets,
      title: 'Zero Water Dilution & Chemical-Free',
      description:
        'We never dilute our milk with water, ice, detergents, or synthetic emulsifiers. What comes from the cow or goat is filtered and chilled as-is.',
    },
    {
      icon: Snowflake,
      title: 'Cold-Chain Chilling Below 4°C',
      description:
        'Bacteria multiplication is stopped within 20 minutes of morning milking by immediately transferring the milk to insulated stainless steel chillers.',
    },
    {
      icon: ShieldCheck,
      title: 'No Artificial Hormones or Growth Injections',
      description:
        'Our herd grazes on clean, natural green fodder and quality grains. We strictly prohibit oxytocin or synthetic yield boosters.',
    },
    {
      icon: Sparkles,
      title: 'Traditional Churning for Butter & Ghee',
      description:
        'Our desi ghee is prepared by slow-simmering cultured butter over low flame until golden and fragrant, preserving natural rich digestive qualities.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          {OFFICIAL_STORE_NAME} Standard
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-800 leading-tight">
          Our Promise to your family: Pure, unadulterated dairy as nature intended.
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          In a market flooded with synthetic powders, vegetable oil additives, and diluted milk, {OFFICIAL_STORE_NAME} was founded by {OFFICIAL_STORE_OWNER} on one clear rule: we only deliver what we feed our own family.
        </p>
      </div>

      {/* Visual Farm Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-card border border-borderCream">
          <Image
            src="/products/hero-farm.jpg"
            alt={`${OFFICIAL_STORE_NAME} Cattle Farm in Dera Ismail Khan`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 text-white text-xs font-medium">
            Morning milking and hygiene inspection · Dera Ismail Khan
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFDFA] p-8 rounded-3xl border border-borderCream space-y-4 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-forest-800">
              Why Pure Milk Matters
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Commercial packaged UHT milk goes through harsh homogenization, chemical stripping, and reconstitution using imported dried powders.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              At {OFFICIAL_STORE_NAME}, milk is raw whole milk containing all its original fat-soluble vitamins (A, D, E, and K), digestive enzymes, and unheated proteins.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-forest-800 text-white rounded-xl font-semibold text-xs hover:bg-forest-900 transition-colors"
              >
                Order Today&apos;s Batch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Standards */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            Uncompromising Quality
          </span>
          <h2 className="font-serif text-3xl font-bold text-forest-800">
            Our 4 Pillars of Dairy Purity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {standards.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFFDFA] p-8 rounded-3xl border border-borderCream space-y-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-forest-100 flex items-center justify-center text-forest-800">
                  <Icon className="w-6 h-6 text-forest-800" />
                </div>
                <h3 className="font-serif text-xl font-bold text-forest-800">
                  {s.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
