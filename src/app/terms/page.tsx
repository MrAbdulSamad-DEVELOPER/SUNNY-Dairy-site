import React from 'react';
import { OFFICIAL_STORE_NAME, OFFICIAL_STORE_OWNER, OFFICIAL_PHONE_NUMBER, OFFICIAL_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const metadata = {
  title: `Terms & Conditions — ${OFFICIAL_STORE_NAME}`,
  description: `Terms and conditions for dairy ordering and delivery with ${OFFICIAL_STORE_NAME}.`,
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-2 pb-6 border-b border-borderCream">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          Terms of Service
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
          Terms & Conditions
        </h1>
        <p className="text-xs text-muted">Effective Date: November 2026 · {OFFICIAL_STORE_NAME}</p>
      </div>

      <div className="bg-[#FFFDFA] p-8 rounded-3xl border border-borderCream space-y-6 text-sm text-forest-900 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-800">1. Nature of Products</h2>
          <p className="text-muted">
            {OFFICIAL_STORE_NAME} provides farm-fresh raw milk, cultured dahi, artisanal makhan, desi ghee, and traditional sweets. Because these products are pure and contain zero chemical stabilizers or synthetic preservatives, they are highly perishable. Customers should immediately refrigerate or boil raw milk upon receipt.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-800">2. Pricing & &ldquo;Price on Request&rdquo;</h2>
          <p className="text-muted">
            Prices for certain dairy items (fresh milk, dahi, and traditional sweets) are subject to daily farm yield and batch sizes. These items are marked as &ldquo;Price on Request&rdquo;. Final amounts are confirmed with the customer via WhatsApp or phone call prior to dispatch. Placing an order online does not charge any card.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-800">3. Delivery & Inspection</h2>
          <p className="text-muted">
            Deliveries occur primarily during the morning window across active zones in Dera Ismail Khan. Customers are requested to inspect the bottles and seal before paying the delivery rider. If an item arrives compromised, you may decline acceptance without any penalty.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-800">4. Cancellations & Modifications</h2>
          <p className="text-muted">
            To cancel or amend a morning order, please notify {OFFICIAL_STORE_OWNER} on WhatsApp at +{OFFICIAL_WHATSAPP_NUMBER} or phone {OFFICIAL_PHONE_NUMBER} by 9:00 PM the previous evening so morning bottling counts can be adjusted. You can also request cancellation through our online Track Order portal.
          </p>
        </section>
      </div>
    </div>
  );
}
