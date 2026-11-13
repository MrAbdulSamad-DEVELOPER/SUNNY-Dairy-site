import React from 'react';
import { OFFICIAL_STORE_NAME, OFFICIAL_STORE_OWNER, OFFICIAL_PHONE_NUMBER } from '@/lib/whatsapp';

export const metadata = {
  title: `Privacy Policy — ${OFFICIAL_STORE_NAME}`,
  description: `Privacy policy and customer data handling at ${OFFICIAL_STORE_NAME}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-2 pb-6 border-b border-borderCream">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          Legal & Privacy
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted">Last updated: November 2026 · {OFFICIAL_STORE_NAME}</p>
      </div>

      <div className="bg-[#FFFDFA] p-8 rounded-3xl border border-borderCream space-y-6 text-sm text-forest-900 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-800">1. Information We Collect</h2>
          <p className="text-muted">
            When you place an order on {OFFICIAL_STORE_NAME}, we collect your full name, telephone number, WhatsApp number, and delivery street address in Dera Ismail Khan. This information is required strictly to fulfill and deliver your dairy orders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-800">2. How We Use Your Data</h2>
          <p className="text-muted">
            Your data is used solely to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted text-xs">
            <li>Verify daily morning order details and route logistics.</li>
            <li>Send order confirmation messages and batch pricing via WhatsApp or phone call.</li>
            <li>Enable our delivery rider to locate your home accurately.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-800">3. No Third-Party Data Selling</h2>
          <p className="text-muted">
            We never sell, rent, or trade your contact or location data to advertising networks or third-party marketers. Your details remain confidential between you and {OFFICIAL_STORE_NAME}.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-800">4. Payment Information</h2>
          <p className="text-muted">
            We do not store credit card numbers. All orders are completed via Cash on Delivery or upon-arrival transfer directly to {OFFICIAL_STORE_OWNER} or authorized riders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-800">5. Contact for Privacy Questions</h2>
          <p className="text-muted">
            For questions about your order data, you may reach {OFFICIAL_STORE_OWNER} directly at {OFFICIAL_PHONE_NUMBER}.
          </p>
        </section>
      </div>
    </div>
  );
}
