import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import {
  generateWhatsAppOrderMessage,
  getWhatsAppUrl,
  OFFICIAL_STORE_NAME,
  OFFICIAL_STORE_OWNER,
  OFFICIAL_PHONE_NUMBER,
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_UBL_BANK_NAME,
  OFFICIAL_UBL_ACCOUNT_NUMBER,
} from '@/lib/whatsapp';
import {
  CheckCircle2,
  MessageSquare,
  Building2,
  Clock,
  Printer,
  Search,
  ArrowRight,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

interface OrderConfirmationProps {
  params: {
    orderNumber: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: true,
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const latestPayment = order.payments?.[0];

  // Generate WhatsApp message
  const whatsappMessage = generateWhatsAppOrderMessage({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerWhatsapp: order.customerWhatsapp,
    deliveryAddress: order.deliveryAddress,
    city: order.city,
    area: order.area,
    deliveryInstructions: order.deliveryInstructions,
    items: order.items,
    subtotal: order.subtotal,
    deliveryCharges: order.deliveryCharges,
    finalTotal: order.finalTotal,
    priceConfirmationRequired: order.priceConfirmationRequired,
    storeName: OFFICIAL_STORE_NAME,
  });

  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-10 lg:p-12 border border-borderCream shadow-card space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-3 pb-6 border-b border-borderCream">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-forest-800 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100/70 px-3 py-1 rounded-full border border-gold-200">
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
            Thank you, {order.customerName.split(' ')[0]}!
          </h1>
          <p className="text-sm text-muted max-w-lg mx-auto">
            Your dairy order has been recorded in {OFFICIAL_STORE_NAME}&apos;s farm dispatch queue for morning delivery in Dera Ismail Khan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="px-4 py-1.5 rounded-full bg-cream-100 border border-borderCream text-xs font-mono font-bold text-forest-900">
              Order: #{order.orderNumber}
            </div>
            {order.trackingCode && (
              <div className="px-4 py-1.5 rounded-full bg-forest-100 border border-forest-200 text-xs font-mono font-bold text-forest-800">
                Tracking: {order.trackingCode}
              </div>
            )}
          </div>
        </div>

        {/* Action Pills Bar: Print Invoice & Track Live */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/order-confirmation/${order.orderNumber}/invoice`}
            className="inline-flex items-center space-x-2 bg-cream-200 hover:bg-cream-300 text-forest-900 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-forest-800" />
            <span>View & Print Official Invoice</span>
          </Link>
          <Link
            href={`/track?order=${order.orderNumber}`}
            className="inline-flex items-center space-x-2 bg-forest-800 hover:bg-forest-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs"
          >
            <Search className="w-4 h-4 text-gold-400" />
            <span>Track Live Dispatch Status</span>
          </Link>
        </div>

        {/* ADVANCE PAYMENT STATUS CALLOUT (If ADVANCE_UBL) */}
        {order.paymentMethod === 'ADVANCE_UBL' && (
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
            <div className="flex items-start space-x-3">
              <Building2 className="w-6 h-6 text-amber-900 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Advance Payment — UBL Bank Transfer
                </span>
                <h3 className="font-serif text-lg font-bold text-amber-950">
                  Payment Submitted — Under Manual Verification
                </h3>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Your bank transfer submission has been received. Our store administration will cross-reference the transaction with our actual United Bank Limited statement ({OFFICIAL_UBL_ACCOUNT_NUMBER}) before morning dispatch.
                </p>
              </div>
            </div>

            {/* Submitted Transaction Details */}
            {latestPayment && (
              <div className="bg-white p-4 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted block text-[11px]">Sender Name:</span>
                  <span className="font-bold text-forest-800">{latestPayment.senderName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Transaction ID / TID:</span>
                  <span className="font-mono font-bold text-forest-800">{latestPayment.transactionReference || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Payment Status:</span>
                  <span className="font-bold uppercase tracking-wider text-amber-800">
                    {order.paymentStatus === 'PAID' ? 'Verified' : 'Under Verification'}
                  </span>
                </div>

                {latestPayment.receiptImageUrl && (
                  <div className="sm:col-span-3 pt-2 border-t border-borderCream/60 flex items-center justify-between">
                    <span className="text-muted flex items-center space-x-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Receipt Screenshot Attached</span>
                    </span>
                    <a
                      href={latestPayment.receiptImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-forest-800 hover:text-gold-700 underline"
                    >
                      View Receipt File
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="p-3 bg-amber-100/60 rounded-xl text-[11px] text-amber-950 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Policy Notice:</strong> Uploading a receipt screenshot does not automatically mark an order as paid. Our team manually verifies the funds before final confirmation.
              </span>
            </div>
          </div>
        )}

        {/* DIRECT WHATSAPP ORDER CALLOUT (If DIRECT_WHATSAPP) */}
        {order.paymentMethod === 'DIRECT_WHATSAPP' && (
          <div className="p-6 rounded-2xl bg-[#E8F3ED] border border-forest-200/80 space-y-4">
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-6 h-6 text-forest-800 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-900">
                  Direct WhatsApp Order — Awaiting WhatsApp Confirmation
                </h3>
                <p className="text-xs sm:text-sm text-forest-800/90 mt-1 leading-relaxed">
                  Your order is registered in our system. Please make sure you send the prefilled order summary to Sanaullah on WhatsApp (<strong>+{OFFICIAL_WHATSAPP_NUMBER}</strong>) to confirm your morning delivery slot.
                </p>
              </div>
            </div>

            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Open WhatsApp with Sanaullah</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Order Details & Summary */}
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-forest-800">
            Order Items & Summary
          </h3>

          <div className="bg-cream-50/70 rounded-2xl p-4 sm:p-6 border border-borderCream space-y-4">
            <div className="divide-y divide-borderCream/60">
              {order.items.map((item) => {
                const isConfirmed = !item.priceConfirmationRequired && item.unitPriceSnapshot !== null;
                return (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-bold text-forest-800 block">
                        {item.productNameSnapshot}
                      </span>
                      <span className="text-xs text-muted">
                        Variant: {item.selectedVariant} × {item.quantity}
                      </span>
                    </div>

                    <div className="text-right">
                      {isConfirmed ? (
                        <span className="font-bold text-forest-800">
                          Rs {(item.unitPriceSnapshot! * item.quantity).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-2 py-0.5 rounded">
                          Price to be confirmed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-borderCream space-y-2 text-sm">
              <div className="flex justify-between items-center text-muted text-xs">
                <span>Confirmed Items Subtotal:</span>
                <span className="font-bold text-forest-800">
                  Rs {order.subtotal.toLocaleString()}
                </span>
              </div>

              {order.deliveryCharges > 0 && (
                <div className="flex justify-between items-center text-muted text-xs">
                  <span>Cold-Chain Delivery:</span>
                  <span className="font-bold text-forest-800">
                    Rs {order.deliveryCharges.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-borderCream flex justify-between items-center text-forest-800">
                <span className="font-bold">Total Amount Payable:</span>
                <span className="font-serif font-bold text-xl text-forest-900">
                  {order.finalTotal !== null && order.finalTotal !== undefined
                    ? `Rs ${order.finalTotal.toLocaleString()}`
                    : `Rs ${order.subtotal.toLocaleString()} + Pending`}
                </span>
              </div>

              {order.priceConfirmationRequired && (
                <div className="text-xs text-gold-800 bg-gold-50 p-3 rounded-xl border border-gold-200 mt-2">
                  ⚠️ This order contains fresh items requiring morning batch pricing. Our farm dispatch team will confirm the final amount with you before morning departure.
                </div>
              )}

              <div className="flex justify-between text-xs text-muted pt-2 border-t border-borderCream">
                <span>Payment Method:</span>
                <span className="font-semibold text-forest-800">
                  {order.paymentMethod === 'ADVANCE_UBL'
                    ? 'Advance Payment — UBL Bank Transfer'
                    : order.paymentMethod === 'DIRECT_WHATSAPP'
                    ? 'Direct WhatsApp Order'
                    : order.paymentMethod.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Payment Status:</span>
                <span className="font-bold uppercase tracking-wider text-forest-700">
                  {order.paymentStatus === 'PAID'
                    ? 'Verified & Paid'
                    : order.paymentStatus === 'PAYMENT_SUBMITTED'
                    ? 'Payment Submitted (Under Verification)'
                    : order.paymentStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-borderCream text-sm">
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-forest-800">Customer Details</h4>
            <p className="text-muted">
              <span className="font-semibold text-forest-800">Name:</span> {order.customerName}
            </p>
            <p className="text-muted">
              <span className="font-semibold text-forest-800">Phone:</span> {order.customerPhone}
            </p>
            {order.customerWhatsapp && (
              <p className="text-muted">
                <span className="font-semibold text-forest-800">WhatsApp:</span> {order.customerWhatsapp}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-forest-800">Delivery Destination</h4>
            <p className="text-muted">
              <span className="font-semibold text-forest-800">City / Area:</span> {order.area}, {order.city}
            </p>
            <p className="text-muted">
              <span className="font-semibold text-forest-800">Address:</span> {order.deliveryAddress}
            </p>
            {order.deliveryInstructions && (
              <p className="text-muted">
                <span className="font-semibold text-forest-800">Notes:</span> {order.deliveryInstructions}
              </p>
            )}
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-6 border-t border-borderCream text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-forest-800 hover:text-gold-700 transition-colors uppercase tracking-wider"
          >
            <span>Return to {OFFICIAL_STORE_NAME} Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
