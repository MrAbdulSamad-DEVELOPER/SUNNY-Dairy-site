'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Phone,
  Package,
  Calendar,
  XCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  OFFICIAL_STORE_NAME,
  OFFICIAL_STORE_OWNER,
  OFFICIAL_PHONE_NUMBER,
  getWhatsAppUrl,
} from '@/lib/whatsapp';

interface OrderItem {
  id: string;
  productNameSnapshot: string;
  selectedVariant: string;
  quantity: number;
  unitPriceSnapshot: number | null;
  priceConfirmationRequired: boolean;
}

interface OrderData {
  id: string;
  orderNumber: string;
  trackingCode?: string | null;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  deliveryAddress: string;
  city: string;
  area: string;
  deliveryInstructions?: string | null;
  orderStatus: string;
  paymentMethod: string;
  subtotal: number;
  deliveryCharges: number;
  finalTotal?: number | null;
  priceConfirmationRequired: boolean;
  cancellationRequested: boolean;
  cancellationReason?: string | null;
  estimatedDeliveryTime?: string | null;
  createdAt: string;
  items: OrderItem[];
}

const ORDER_STEPS = [
  { key: 'PENDING', label: 'Order Received', desc: 'Awaiting farm review' },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Milking & batch allocated' },
  { key: 'PREPARING', label: 'Chilling & Packaged', desc: 'Bottled in sterile containers' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'With cold-chain rider' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Arrived at your doorstep' },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('order') || '';

  const [query, setQuery] = useState(queryParam);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cancellation state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  const handleTrack = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setError(null);
    setCancelSuccessMsg(null);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchVal }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No orders found matching this search.');
        setOrders([]);
        setSelectedOrder(null);
      } else {
        setOrders(data.orders);
        setSelectedOrder(data.orders[0] || null);
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while tracking the order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      handleTrack(queryParam);
    }
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(query);
  };

  const handleRequestCancellation = async () => {
    if (!selectedOrder) return;
    setCancelSubmitting(true);
    try {
      const res = await fetch('/api/orders/cancel-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: selectedOrder.orderNumber,
          reason: cancelReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to submit cancellation request.');
      } else {
        setCancelSuccessMsg(data.message);
        setSelectedOrder({
          ...selectedOrder,
          cancellationRequested: true,
          cancellationReason: cancelReason,
        });
        setCancelModalOpen(false);
      }
    } catch (e: any) {
      alert(e.message || 'Error submitting cancellation request.');
    } finally {
      setCancelSubmitting(false);
    }
  };

  // Determine current step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'PRICE_CONFIRMATION_REQUIRED':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100/70 px-3 py-1 rounded-full border border-gold-200">
          Live Dispatch Timeline
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-800">
          Track Your Dairy Order
        </h1>
        <p className="text-sm text-muted">
          Enter your Order Number (e.g. <span className="font-mono font-semibold">SUNNY-2026-...</span>) or your Phone Number to check real-time milking, chilling, and rider delivery status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2.5 rounded-3xl border border-borderCream shadow-md">
          <div className="flex items-center space-x-3 px-3 w-full">
            <Search className="w-5 h-5 text-forest-700 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. SUNNY-2026-1042 or 03001234567"
              className="w-full bg-transparent text-sm sm:text-base text-forest-900 focus:outline-none placeholder:text-muted/70 py-1"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-forest-800 hover:bg-forest-900 text-white rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-95 flex-shrink-0 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Locating...</span>
            ) : (
              <>
                <Truck className="w-4 h-4 text-gold-400" />
                <span>Track Order</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Multiple orders found selector */}
      {orders.length > 1 && (
        <div className="max-w-2xl mx-auto bg-cream-50 p-4 rounded-2xl border border-borderCream space-y-2">
          <span className="text-xs font-bold text-forest-800 uppercase tracking-wide">
            Found {orders.length} orders for this number. Select one:
          </span>
          <div className="flex flex-wrap gap-2">
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedOrder?.id === ord.id
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-white border border-borderCream text-forest-800 hover:bg-cream-100'
                }`}
              >
                #{ord.orderNumber} ({new Date(ord.createdAt).toLocaleDateString()})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Order Details */}
      {selectedOrder && (
        <div className="bg-[#FFFDFA] rounded-3xl border border-borderCream shadow-card overflow-hidden animate-fade-in">
          {/* Order Header Banner */}
          <div className="p-6 sm:p-8 bg-forest-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xl sm:text-2xl font-bold text-gold-400">
                  #{selectedOrder.orderNumber}
                </span>
                {selectedOrder.trackingCode && (
                  <span className="text-xs bg-forest-800 text-forest-200 px-2.5 py-0.5 rounded-full font-mono">
                    Tracking: {selectedOrder.trackingCode}
                  </span>
                )}
              </div>
              <p className="text-xs text-forest-300 mt-1 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()} at{' '}
                  {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/order-confirmation/${selectedOrder.orderNumber}/invoice`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-cream-100 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-white/20"
              >
                <FileText className="w-4 h-4 text-gold-300" />
                <span>Print Invoice</span>
              </Link>
              <a
                href={getWhatsAppUrl(`Hello ${OFFICIAL_STORE_OWNER}! Regarding order #${selectedOrder.orderNumber}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp Help</span>
              </a>
            </div>
          </div>

          {/* Cancellation Notice if active */}
          {selectedOrder.cancellationRequested && (
            <div className="p-4 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Cancellation Requested: </span>
                <span>
                  {selectedOrder.cancellationReason || 'Under review by our dispatch team.'}
                </span>
              </div>
            </div>
          )}

          {cancelSuccessMsg && (
            <div className="p-4 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{cancelSuccessMsg}</span>
            </div>
          )}

          {/* Stepper Progress Bar */}
          {selectedOrder.orderStatus === 'CANCELLED' ? (
            <div className="p-8 text-center bg-red-50/60 border-b border-borderCream space-y-2">
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-red-800">This Order Has Been Cancelled</h3>
              <p className="text-xs text-muted max-w-md mx-auto">
                If you have questions or want to place a new fresh order, please reach out directly on WhatsApp or telephone.
              </p>
            </div>
          ) : (
            <div className="p-6 sm:p-10 border-b border-borderCream bg-[#FAF6EE]">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
                  {ORDER_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(selectedOrder.orderStatus);
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                            isCurrent
                              ? 'bg-gold-500 text-forest-950 ring-4 ring-gold-200 scale-110 shadow-md'
                              : isDone
                              ? 'bg-forest-800 text-white'
                              : 'bg-cream-200 text-muted'
                          }`}
                        >
                          {isDone && !isCurrent ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div>
                          <span
                            className={`text-xs block font-bold ${
                              isCurrent
                                ? 'text-forest-900 font-extrabold'
                                : isDone
                                ? 'text-forest-800'
                                : 'text-muted'
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="text-[10px] text-muted hidden sm:block mt-0.5">
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Details Body */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Items breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-serif text-xl font-bold text-forest-800 flex items-center space-x-2">
                <Package className="w-5 h-5 text-forest-700" />
                <span>Ordered Dairy Items</span>
              </h3>

              <div className="divide-y divide-borderCream/60 border border-borderCream rounded-2xl overflow-hidden bg-white">
                {selectedOrder.items.map((item) => {
                  const isConfirmed = !item.priceConfirmationRequired && item.unitPriceSnapshot !== null;
                  return (
                    <div key={item.id} className="p-4 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-forest-800 block">
                          {item.productNameSnapshot}
                        </span>
                        <span className="text-xs text-muted">
                          Variant: {item.selectedVariant} · Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="text-right">
                        {isConfirmed ? (
                          <span className="font-serif font-bold text-forest-800">
                            Rs {(item.unitPriceSnapshot! * item.quantity).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-2 py-0.5 rounded">
                            Price on Request
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price notes */}
              {selectedOrder.priceConfirmationRequired && (
                <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 text-xs text-forest-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-gold-800">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>Morning Yield Price Confirmation</span>
                  </div>
                  <p className="text-muted">
                    This order includes fresh unpriced items. Final amounts are confirmed with you on WhatsApp prior to morning departure.
                  </p>
                </div>
              )}

              {/* Action Buttons: Cancel */}
              {!selectedOrder.cancellationRequested &&
                selectedOrder.orderStatus !== 'DELIVERED' &&
                selectedOrder.orderStatus !== 'CANCELLED' && (
                  <div className="pt-2">
                    <button
                      onClick={() => setCancelModalOpen(true)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold underline"
                    >
                      Need to cancel or change this order?
                    </button>
                  </div>
                )}
            </div>

            {/* Right: Summary & Customer details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-cream-50 p-6 rounded-2xl border border-borderCream space-y-4">
                <h4 className="font-serif text-lg font-bold text-forest-800">
                  Payment & Delivery Summary
                </h4>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Confirmed Subtotal:</span>
                    <span className="font-semibold text-forest-800">
                      Rs {selectedOrder.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {selectedOrder.deliveryCharges > 0 && (
                    <div className="flex justify-between text-muted">
                      <span>Delivery Fee:</span>
                      <span className="font-semibold text-forest-800">
                        Rs {selectedOrder.deliveryCharges.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-borderCream flex justify-between items-center text-forest-800">
                    <span className="font-bold">Total Payable:</span>
                    <span className="font-serif text-lg font-bold text-forest-900">
                      {selectedOrder.finalTotal !== null && selectedOrder.finalTotal !== undefined
                        ? `Rs ${selectedOrder.finalTotal.toLocaleString()}`
                        : `Rs ${selectedOrder.subtotal.toLocaleString()} + Pending`}
                    </span>
                  </div>

                  <div className="pt-2 text-xs text-muted space-y-1">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-semibold text-forest-800">
                        {selectedOrder.paymentMethod === 'CASH_ON_DELIVERY'
                          ? 'Cash on Delivery'
                          : 'WhatsApp Confirmation'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Window:</span>
                      <span className="font-semibold text-forest-800">7:00 AM – 11:30 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Destination */}
              <div className="bg-white p-6 rounded-2xl border border-borderCream space-y-2 text-xs sm:text-sm">
                <h4 className="font-serif font-bold text-forest-800">Delivery Destination</h4>
                <p className="text-muted">
                  <strong className="text-forest-800">Recipient:</strong> {selectedOrder.customerName}
                </p>
                <p className="text-muted">
                  <strong className="text-forest-800">Phone:</strong> {selectedOrder.customerPhone}
                </p>
                <p className="text-muted">
                  <strong className="text-forest-800">Address:</strong> {selectedOrder.deliveryAddress}, {selectedOrder.area}, {selectedOrder.city}
                </p>
                {selectedOrder.deliveryInstructions && (
                  <p className="text-muted">
                    <strong className="text-forest-800">Instructions:</strong> {selectedOrder.deliveryInstructions}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-borderCream animate-scale-up">
            <h3 className="font-serif text-xl font-bold text-forest-800">
              Request Order Cancellation
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Please let {OFFICIAL_STORE_OWNER} know why you need to cancel order #{selectedOrder?.orderNumber}:
            </p>

            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Changed schedule, placed duplicate order, etc."
              className="w-full p-3 rounded-xl border border-borderCream text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
            />

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted hover:text-forest-800"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancelSubmitting}
                onClick={handleRequestCancellation}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
              >
                {cancelSubmitting ? 'Submitting...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-muted">Loading tracking portal...</div>}>
      <TrackContent />
    </Suspense>
  );
}
