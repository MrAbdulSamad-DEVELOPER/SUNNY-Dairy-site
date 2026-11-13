import React from 'react';
import { Phone, MessageSquare, Mail, MapPin, Clock, Calendar } from 'lucide-react';
import {
  OFFICIAL_STORE_NAME,
  OFFICIAL_STORE_OWNER,
  OFFICIAL_PHONE_NUMBER,
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_EMAIL,
  getWhatsAppUrl,
} from '@/lib/whatsapp';

export const metadata = {
  title: `Contact Us — ${OFFICIAL_STORE_NAME} Dera Ismail Khan`,
  description:
    `Contact the ${OFFICIAL_STORE_NAME} dairy farm team and ${OFFICIAL_STORE_OWNER} for orders, deliveries, or farm inquiries in Dera Ismail Khan, Pakistan.`,
};

export default function ContactPage() {
  const directWhatsApp = getWhatsAppUrl(
    `Hello ${OFFICIAL_STORE_OWNER}! I would like to inquire about home delivery of fresh milk and dairy products in Dera Ismail Khan.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-800 leading-tight">
          We are always happy to talk about pure milk and traditional sweets
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          Whether you want to place a custom order, inquire about daily morning breakfast delivery, or verify delivery to your street, reach out directly to {OFFICIAL_STORE_OWNER}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Information Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#FFFDFA] p-8 rounded-3xl border border-borderCream space-y-6 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-forest-800">
              Farm & Dispatch Contact
            </h2>

            <div className="space-y-5 text-sm">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800 flex-shrink-0">
                  <Phone className="w-5 h-5 text-forest-800" />
                </div>
                <div>
                  <span className="text-xs text-muted font-semibold uppercase block">Direct Phone</span>
                  <a
                    href={`tel:${OFFICIAL_PHONE_NUMBER}`}
                    className="text-base font-bold text-forest-800 hover:text-gold-700 transition-colors"
                  >
                    {OFFICIAL_PHONE_NUMBER}
                  </a>
                  <p className="text-xs text-muted mt-0.5">Direct contact: {OFFICIAL_STORE_OWNER} · 6:00 AM – 9:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E8F3ED] flex items-center justify-center text-forest-800 flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-forest-800" />
                </div>
                <div>
                  <span className="text-xs text-muted font-semibold uppercase block">WhatsApp Support</span>
                  <a
                    href={directWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-forest-800 hover:text-gold-700 transition-colors"
                  >
                    +{OFFICIAL_WHATSAPP_NUMBER}
                  </a>
                  <p className="text-xs text-muted mt-0.5">Fastest response for order tracking & pricing confirmation</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-forest-800 flex-shrink-0">
                  <Mail className="w-5 h-5 text-forest-800" />
                </div>
                <div>
                  <span className="text-xs text-muted font-semibold uppercase block">Email Inquiries</span>
                  <a
                    href={`mailto:${OFFICIAL_EMAIL}`}
                    className="text-base font-bold text-forest-800 hover:text-gold-700 transition-colors"
                  >
                    {OFFICIAL_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-forest-800" />
                </div>
                <div>
                  <span className="text-xs text-muted font-semibold uppercase block">Farm Location</span>
                  <p className="text-base font-bold text-forest-800">
                    {OFFICIAL_STORE_NAME} Farm, Dera Ismail Khan
                  </p>
                  <p className="text-xs text-muted mt-0.5">Dera Ismail Khan, Khyber Pakhtunkhwa, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={directWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Message {OFFICIAL_STORE_OWNER} on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Operating Hours & Dispatch Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#FAF3E4] p-8 rounded-3xl border border-borderCream space-y-6">
            <h3 className="font-serif text-2xl font-bold text-forest-800">
              Farm Hours & Milking Cycles
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-forest-900">
              <div className="p-4 bg-white rounded-2xl border border-borderCream/60 flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gold-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Morning Milking & Chilling:</span>
                  <span className="text-muted">4:30 AM – 6:30 AM daily</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-borderCream/60 flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gold-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Chilled Doorstep Delivery:</span>
                  <span className="text-muted">Daily morning delivery in DI Khan & nationwide dispatch across Pakistan</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-borderCream/60 flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gold-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Days of Operation:</span>
                  <span className="text-muted">7 days a week, 365 days a year</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-forest-800 text-cream-50 rounded-2xl text-xs space-y-1">
              <span className="font-bold block text-gold-300">Same-Day Urgent Orders:</span>
              <p className="text-forest-200">
                Call {OFFICIAL_PHONE_NUMBER} before 8:00 AM to see if your street falls on our active morning rider route.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
