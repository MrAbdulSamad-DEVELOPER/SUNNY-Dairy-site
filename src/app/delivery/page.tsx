import React from 'react';
import Link from 'next/link';
import { Truck, MapPin, Clock, Banknote, ShieldAlert, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import {
  OFFICIAL_STORE_NAME,
  OFFICIAL_STORE_OWNER,
  OFFICIAL_PHONE_NUMBER,
  OFFICIAL_WHATSAPP_NUMBER,
  getWhatsAppUrl,
} from '@/lib/whatsapp';

export const metadata = {
  title: `Delivery Areas & FAQs — ${OFFICIAL_STORE_NAME} Dera Ismail Khan`,
  description:
    'Find our daily fresh milk delivery zones across Dera Ismail Khan, morning delivery hours, cold-chain protocol, and answers to common dairy questions.',
};

export default function DeliveryAndFAQPage() {
  const areas = [
    'D.I. Khan Cantt Area & Officers Colony',
    'Circular Road & Topanwala Gate',
    'University Road & Gomal University',
    'Bannu Road, Grid Station & Model Town',
    'Multan Road & Mandra Area',
    'Qayyum Nagar & Zafarabad',
    'Tank Road & Murial Sector',
    'Commissionery Bazaar & City Center',
  ];

  const faqs = [
    {
      q: 'Why are some products labeled "Price on Request"?',
      a: 'Fresh cow and goat milk yields fluctuate naturally depending on daily forage and seasonality. Traditional Pakistani sweets and artisanal dahi are prepared in small daily batches. To avoid misleading customers with fixed stale rates, we confirm exact batch prices transparently via WhatsApp before dispatch.',
    },
    {
      q: 'Do I have to pay upfront or online?',
      a: `No. ${OFFICIAL_STORE_NAME} operates on a strict Cash on Delivery (or Raast/bank transfer upon arrival) model. You inspect the milk bottles and sweet boxes when the rider arrives before handing over payment.`,
    },
    {
      q: 'Is the milk raw or pasteurized?',
      a: 'Our milk is 100% farm fresh raw whole milk, chilled immediately below 4°C. We do not use high-heat UHT industrial homogenization which strips natural enzymes. We recommend gently boiling the milk once at home as per standard Pakistani household tradition.',
    },
    {
      q: 'What is the minimum order quantity for home delivery?',
      a: 'We deliver orders starting from 2 liters of milk or any combination of milk, makhan, or sweets. There is no large order requirement.',
    },
    {
      q: 'How is Makhan and Desi Ghee packaged?',
      a: 'Makhan is packaged in chilled greaseproof parchment containers, while our Desi Pure Ghee is sealed in food-grade, airtight jars to preserve its authentic aroma and golden granular texture.',
    },
    {
      q: 'How can I pause or change my daily milk delivery?',
      a: `You can simply message Sanaullah on WhatsApp at +${OFFICIAL_WHATSAPP_NUMBER} or call ${OFFICIAL_PHONE_NUMBER} with your order number 12 hours prior to delivery.`,
    },
  ];

  const whatsappInquiry = getWhatsAppUrl(
    `Hello ${OFFICIAL_STORE_NAME}! Does your farm deliver to my neighborhood in Dera Ismail Khan?`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          Distribution & Questions
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-800 leading-tight">
          Fresh morning delivery straight to your doorstep across Dera Ismail Khan
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          {OFFICIAL_STORE_NAME} maintains a dedicated cold-chain morning delivery network across major residential sectors in Dera Ismail Khan.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFDFA] p-6 rounded-3xl border border-borderCream space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
            <Clock className="w-5 h-5 text-forest-800" />
          </div>
          <h3 className="font-serif text-lg font-bold text-forest-800">7:00 AM – 11:30 AM</h3>
          <p className="text-xs text-muted leading-relaxed">
            Standard morning doorstep window. Milk is bottled at dawn and delivered chilled for your family&apos;s breakfast.
          </p>
        </div>

        <div className="bg-[#FFFDFA] p-6 rounded-3xl border border-borderCream space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
            <Truck className="w-5 h-5 text-forest-800" />
          </div>
          <h3 className="font-serif text-lg font-bold text-forest-800">Insulated Coolers</h3>
          <p className="text-xs text-muted leading-relaxed">
            Our riders carry temperature-sealed containers, ensuring milk maintains the farm chilling temperature of under 4°C.
          </p>
        </div>

        <div className="bg-[#FFFDFA] p-6 rounded-3xl border border-borderCream space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
            <Banknote className="w-5 h-5 text-forest-800" />
          </div>
          <h3 className="font-serif text-lg font-bold text-forest-800">Pay on Delivery</h3>
          <p className="text-xs text-muted leading-relaxed">
            Cash on delivery or Raast transfer. Inspect the purity, aroma, and packaging before paying.
          </p>
        </div>
      </div>

      {/* Delivery Areas in Dera Ismail Khan */}
      <div className="bg-[#FAF3E4] rounded-3xl p-8 sm:p-12 border border-borderCream space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            Current Coverage
          </span>
          <h2 className="font-serif text-3xl font-bold text-forest-800">
            Covered Dera Ismail Khan Sectors & Neighborhoods
          </h2>
          <p className="text-sm text-muted">
            If your area is not listed below, send us a WhatsApp message to verify our morning route.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map((area, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-borderCream/80 flex items-center space-x-3 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-forest-800">{area}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <a
            href={whatsappInquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all"
          >
            <MessageSquare className="w-4 h-4 text-gold-400" />
            <span>Check Coverage via WhatsApp</span>
          </a>
          <Link
            href="/track"
            className="inline-flex items-center space-x-2 bg-white text-forest-800 border border-borderCream font-semibold text-xs px-6 py-3 rounded-xl hover:bg-cream-100 transition-all"
          >
            <Truck className="w-4 h-4 text-forest-800" />
            <span>Track Existing Order</span>
          </Link>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl font-bold text-forest-800">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDFA] p-6 sm:p-8 rounded-3xl border border-borderCream space-y-3 shadow-sm"
            >
              <h4 className="font-serif text-lg font-bold text-forest-800">
                {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
