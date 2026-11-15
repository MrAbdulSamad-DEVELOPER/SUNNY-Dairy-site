import React from 'react';
import { Milk, Snowflake, Banknote, ShieldCheck } from 'lucide-react';

interface TrustBannerProps {
  cmsData?: {
    isEnabled?: boolean;
    metadata?: string;
  };
}

export default function TrustBanner({ cmsData }: TrustBannerProps) {
  if (cmsData?.isEnabled === false) {
    return null;
  }

  let benefits = [
    {
      title: 'Collected fresh',
      description: 'Milk collected daily at morning, zero preservatives or additives.',
    },
    {
      title: 'Kept cool',
      description: 'Chilled in food-grade stainless tanks immediately after milking.',
    },
    {
      title: 'Pay on delivery',
      description: 'Pay in cash or easy digital transfer only when your fresh order arrives.',
    },
  ];

  if (cmsData?.metadata) {
    try {
      const parsed = typeof cmsData.metadata === 'string' ? JSON.parse(cmsData.metadata) : cmsData.metadata;
      if (Array.isArray(parsed) && parsed.length > 0) {
        benefits = parsed;
      }
    } catch {}
  }

  const icons = [Milk, Snowflake, Banknote, ShieldCheck];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="bg-[#F3EBDD] rounded-3xl p-8 sm:p-10 border border-borderCream/60">
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(benefits.length, 3)} gap-8 md:gap-10`}>
          {benefits.map((b, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div key={idx} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-forest-800/10 flex items-center justify-center text-forest-800">
                    <Icon className="w-5 h-5 text-forest-800" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-forest-800">
                    {b.title}
                  </h4>
                </div>
                <p className="text-sm text-muted leading-relaxed pl-13">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
