import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  OFFICIAL_STORE_NAME,
  OFFICIAL_STORE_OWNER,
  OFFICIAL_PHONE_NUMBER,
  OFFICIAL_WHATSAPP_NUMBER,
} from '@/lib/whatsapp';
import { Printer, ArrowLeft } from 'lucide-react';
import PrintButton from './PrintButton';

interface InvoicePageProps {
  params: {
    orderNumber: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function OrderInvoicePage({ params }: InvoicePageProps) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 print:p-0 print:bg-white text-neutral-900">
      {/* Top action bar - hidden during print */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/order-confirmation/${order.orderNumber}`}
          className="text-xs sm:text-sm font-semibold text-forest-800 hover:text-gold-700 flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order Confirmation</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            href={`/track?order=${order.orderNumber}`}
            className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-forest-900 rounded-xl text-xs font-bold transition-colors"
          >
            Track Status
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Printable Receipt Paper */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl print:rounded-none shadow-xl print:shadow-none border border-neutral-200 print:border-none p-8 sm:p-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-forest-800 gap-4">
          <div className="space-y-1">
            <div className="relative h-12 w-40 flex items-center">
              <Image
                src="/nev-logo.png"
                alt={OFFICIAL_STORE_NAME}
                width={160}
                height={50}
                className="max-h-12 w-auto object-contain"
                priority
              />
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Pure Dairy Farm · Dera Ismail Khan, Khyber Pakhtunkhwa, Pakistan
            </p>
            <p className="text-xs text-neutral-500">
              Proprietor: <strong className="text-neutral-800">{OFFICIAL_STORE_OWNER}</strong> · Tel: {OFFICIAL_PHONE_NUMBER}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
              Official Tax / Order Invoice
            </span>
            <div className="font-mono text-lg font-bold text-neutral-900">
              #{order.orderNumber}
            </div>
            {order.trackingCode && (
              <div className="text-xs font-mono text-neutral-500">
                Tracking: {order.trackingCode}
              </div>
            )}
            <div className="text-xs text-neutral-500">Date: {orderDate}</div>
          </div>
        </div>

        {/* Customer & Delivery Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-neutral-500 text-[10px] block">
              Billed & Delivered To:
            </span>
            <p className="text-sm font-bold text-neutral-900">{order.customerName}</p>
            <p>Phone: {order.customerPhone}</p>
            {order.customerWhatsapp && <p>WhatsApp: {order.customerWhatsapp}</p>}
          </div>

          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-neutral-500 text-[10px] block">
              Delivery Address (Dera Ismail Khan):
            </span>
            <p className="text-sm font-semibold text-neutral-900">
              {order.area}, {order.city}
            </p>
            <p>{order.deliveryAddress}</p>
            {order.deliveryInstructions && (
              <p className="italic text-neutral-500 mt-1">Note: {order.deliveryInstructions}</p>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="py-3 pr-4">Item & Variant</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 pl-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {order.items.map((item) => {
                const isConfirmed = !item.priceConfirmationRequired && item.unitPriceSnapshot !== null;
                const total = isConfirmed ? item.unitPriceSnapshot! * item.quantity : null;

                return (
                  <tr key={item.id} className="text-neutral-800">
                    <td className="py-3 pr-4">
                      <div className="font-bold text-neutral-900">{item.productNameSnapshot}</div>
                      <div className="text-[11px] text-neutral-500">Variant: {item.selectedVariant}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">
                      {isConfirmed ? (
                        `Rs ${item.unitPriceSnapshot?.toLocaleString()}`
                      ) : (
                        <span className="text-amber-700 italic text-xs">On Request</span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right font-bold">
                      {total !== null ? (
                        `Rs ${total.toLocaleString()}`
                      ) : (
                        <span className="text-amber-700 italic text-xs">Pending Batch</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="pt-4 border-t-2 border-neutral-200 flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Confirmed Subtotal:</span>
              <span className="font-semibold text-neutral-900">
                Rs {order.subtotal.toLocaleString()}
              </span>
            </div>

            {order.deliveryCharges > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Cold-Chain Delivery:</span>
                <span className="font-semibold text-neutral-900">
                  Rs {order.deliveryCharges.toLocaleString()}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-300 flex justify-between items-center text-neutral-900 font-bold text-base">
              <span>Amount Payable:</span>
              <span className="font-mono text-lg text-emerald-800">
                {order.finalTotal !== null && order.finalTotal !== undefined
                  ? `Rs ${order.finalTotal.toLocaleString()}`
                  : `Rs ${order.subtotal.toLocaleString()} + Pending`}
              </span>
            </div>

            <div className="pt-1 text-[11px] text-neutral-500 text-right">
              Payment Method:{' '}
              <strong className="text-neutral-800">
                {order.paymentMethod === 'ADVANCE_UBL'
                  ? 'Advance Payment — UBL Bank Transfer'
                  : order.paymentMethod === 'DIRECT_WHATSAPP'
                  ? 'Direct WhatsApp Order'
                  : order.paymentMethod.replace(/_/g, ' ')}
              </strong>
            </div>
          </div>
        </div>

        {/* Dairy Handling Instructions */}
        <div className="pt-6 border-t border-neutral-200 text-[11px] text-neutral-500 space-y-1">
          <p className="font-bold text-neutral-700">Farm Fresh Purity Advisory:</p>
          <p>
            • Raw milk contains no chemical stabilizers or preservatives. Please boil once upon arrival and keep refrigerated below 4°C.
          </p>
          <p>
            • For inquiries, subscriptions, or amendments, call Sanaullah at {OFFICIAL_PHONE_NUMBER} or WhatsApp +{OFFICIAL_WHATSAPP_NUMBER}.
          </p>
        </div>

        {/* Footer Stamp */}
        <div className="pt-4 text-center text-[10px] text-neutral-400">
          Thank you for choosing {OFFICIAL_STORE_NAME}! Certified 100% pure farm dairy delivered to your door.
        </div>
      </div>
    </div>
  );
}
