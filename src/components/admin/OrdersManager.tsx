'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrderDTO, OrderStatus } from '@/types';
import { Search, Filter, MessageSquare, Check, X, Edit2, AlertCircle, Phone, MapPin, Eye, Printer, Truck } from 'lucide-react';
import { getWhatsAppUrl, OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

export default function OrdersManager() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [editingPrices, setEditingPrices] = useState<Record<string, number | string>>({});
  const [editStatus, setEditStatus] = useState<OrderStatus>('PENDING');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/orders?search=${encodeURIComponent(search)}&status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const handleOpenDetail = (order: OrderDTO) => {
    setSelectedOrder(order);
    setEditStatus(order.orderStatus);
    setEditNotes(order.adminNotes || '');

    // Prepopulate editable prices for items
    const prices: Record<string, number | string> = {};
    order.items.forEach((item) => {
      if (item.confirmedPrice !== null && item.confirmedPrice !== undefined) {
        prices[item.id] = item.confirmedPrice;
      } else if (item.unitPriceSnapshot !== null && item.unitPriceSnapshot !== undefined) {
        prices[item.id] = item.unitPriceSnapshot;
      } else {
        prices[item.id] = '';
      }
    });
    setEditingPrices(prices);
    setMessage(null);
  };

  const handleSaveOrderUpdate = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    setMessage(null);

    try {
      const parsedItemPrices: Record<string, number | null> = {};
      for (const [itemId, val] of Object.entries(editingPrices)) {
        if (val === '' || val === null || val === undefined) {
          parsedItemPrices[itemId] = null;
        } else {
          parsedItemPrices[itemId] = parseFloat(val.toString());
        }
      }

      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: editStatus,
          adminNotes: editNotes,
          itemPrices: parsedItemPrices,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Order updated successfully!');
        setSelectedOrder(data.order);
        // Refresh orders list
        fetchOrders();
      } else {
        setMessage(data.error || 'Failed to update order');
      }
    } catch (e: any) {
      setMessage(e.message || 'Error updating order');
    } finally {
      setSaving(false);
    }
  };

  const statusOptions: OrderStatus[] = [
    'PENDING',
    'PRICE_CONFIRMATION_REQUIRED',
    'CONFIRMED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-4 w-full min-w-0 max-w-full">
      {/* Top Filter Bar */}
      <div className="bg-[#FFFDFA] p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-borderCream shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 min-w-0 max-w-full">
        {/* Search */}
        <div className="relative w-full min-w-0 md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Name, or Phone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-cream-50/60 text-xs text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-800"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full min-w-0 max-w-full md:w-auto pb-1.5 md:pb-0 text-xs scrollbar-none">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-forest-800 text-white font-bold'
                : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'PENDING'
                ? 'bg-forest-800 text-white font-bold'
                : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'CONFIRMED'
                ? 'bg-forest-800 text-white font-bold'
                : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter('OUT_FOR_DELIVERY')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'OUT_FOR_DELIVERY'
                ? 'bg-forest-800 text-white font-bold'
                : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
            }`}
          >
            Out for Delivery
          </button>
          <button
            onClick={() => setStatusFilter('DELIVERED')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'DELIVERED'
                ? 'bg-forest-800 text-white font-bold'
                : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders Container */}
      <div className="bg-[#FFFDFA] rounded-2xl sm:rounded-3xl border border-borderCream shadow-xs overflow-hidden min-w-0 max-w-full">
        {loading ? (
          <div className="py-16 text-center text-muted text-xs">
            Loading orders from database...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-2.5 px-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto text-forest-800 shadow-xs">
              <Truck className="w-6 h-6 text-forest-700" />
            </div>
            <p className="font-bold text-base text-forest-900">No orders found</p>
            <p className="text-xs text-muted leading-relaxed">
              {search || statusFilter !== 'ALL'
                ? 'Try modifying your search query or status filter.'
                : 'Customer orders placed on the store will appear here in real time.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card List View (< 768px) with Product Images */}
            <div className="block md:hidden divide-y divide-borderCream/70">
              {orders.map((ord) => {
                const totalText =
                  ord.finalTotal !== null
                    ? `Rs ${ord.finalTotal.toLocaleString()}`
                    : ord.subtotal > 0
                    ? `Rs ${ord.subtotal.toLocaleString()} (Pending)`
                    : 'Price on Request';

                return (
                  <div key={ord.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-forest-900 text-sm">
                          #{ord.orderNumber}
                        </span>
                        <div className="text-[11px] text-muted mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          ·{' '}
                          {new Date(ord.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>

                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : ord.orderStatus === 'PRICE_CONFIRMATION_REQUIRED'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.orderStatus === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-cream-200 text-forest-800'
                        }`}
                      >
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {ord.cancellationRequested && (
                      <div className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[11px] font-bold">
                        Customer requested cancellation
                      </div>
                    )}

                    {/* Ordered Items with Real Photos */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">
                        Ordered Items ({ord.items.length}):
                      </span>
                      <div className="space-y-1.5">
                        {ord.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-2.5 bg-cream-50/70 p-2 rounded-xl border border-borderCream/60"
                          >
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0 border border-borderCream shadow-xs">
                              <img
                                src={item.product?.imageUrl || '/products/cow-milk.jpg'}
                                alt={item.productNameSnapshot}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/products/cow-milk.jpg';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-forest-900 text-xs truncate block">
                                {item.productNameSnapshot}
                              </span>
                              <span className="text-[11px] text-muted">
                                Size: {item.selectedVariant} · Qty: {item.quantity}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-forest-800">
                              {item.confirmedPrice !== null
                                ? `Rs ${(item.confirmedPrice * item.quantity).toLocaleString()}`
                                : item.unitPriceSnapshot !== null
                                ? `Rs ${(item.unitPriceSnapshot * item.quantity).toLocaleString()}`
                                : 'On Request'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="p-2.5 rounded-xl bg-cream-50/70 border border-borderCream/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-forest-900">{ord.customerName}</span>
                        <span className="font-mono text-muted">{ord.customerPhone}</span>
                      </div>
                      <div className="text-[11px] text-muted truncate">
                        📍 {ord.area}, {ord.deliveryAddress}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-borderCream/40 font-semibold">
                        <span className="text-muted text-[11px]">Total Amount:</span>
                        <span className="text-forest-900 font-bold">{totalText}</span>
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex items-center space-x-2 pt-1">
                      <Link
                        href={`/order-confirmation/${ord.orderNumber}/invoice`}
                        target="_blank"
                        className="p-2 rounded-xl border border-borderCream bg-cream-50 hover:bg-cream-100 text-forest-800 transition-colors flex items-center justify-center"
                        title="Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleOpenDetail(ord)}
                        className="flex-1 py-2 px-4 rounded-xl bg-forest-800 text-white font-semibold text-xs hover:bg-forest-900 transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <Eye className="w-4 h-4 text-gold-400" />
                        <span>Manage & Confirm Order</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= 768px) with Product Images */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-borderCream bg-cream-100/60 text-muted uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3 px-5">Order Details</th>
                    <th className="py-3 px-4">Items Ordered</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Area / Destination</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderCream/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-mono font-bold text-forest-900 text-sm">
                          #{ord.orderNumber}
                        </div>
                        <span className="text-[11px] text-muted block">
                          {new Date(ord.createdAt).toLocaleDateString()} · {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {ord.cancellationRequested && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-800">
                            Cancel Requested
                          </span>
                        )}
                      </td>

                      {/* Items with Thumbnails */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5 max-w-xs">
                          {ord.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                              <div className="w-7 h-7 rounded-md overflow-hidden bg-cream-100 border border-borderCream flex-shrink-0">
                                <img
                                  src={item.product?.imageUrl || '/products/cow-milk.jpg'}
                                  alt={item.productNameSnapshot}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/products/cow-milk.jpg';
                                  }}
                                />
                              </div>
                              <span className="text-[11px] font-medium text-forest-900 truncate">
                                {item.productNameSnapshot} ({item.selectedVariant}×{item.quantity})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-forest-800">{ord.customerName}</div>
                        <div className="text-muted text-[11px]">{ord.customerPhone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-forest-800">{ord.area}</div>
                        <div className="text-muted text-[11px] truncate max-w-xs">{ord.deliveryAddress}</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-forest-800">
                        {ord.finalTotal !== null ? (
                          `Rs ${ord.finalTotal.toLocaleString()}`
                        ) : ord.subtotal > 0 ? (
                          `Rs ${ord.subtotal.toLocaleString()} + Pending`
                        ) : (
                          'Price on Request'
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.orderStatus === 'DELIVERED'
                              ? 'bg-green-100 text-green-800'
                              : ord.orderStatus === 'PRICE_CONFIRMATION_REQUIRED'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.orderStatus === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.orderStatus === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-cream-200 text-forest-800'
                          }`}
                        >
                          {ord.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <Link
                          href={`/order-confirmation/${ord.orderNumber}/invoice`}
                          target="_blank"
                          className="px-2.5 py-1.5 rounded-lg border border-borderCream bg-white hover:bg-cream-100 text-forest-800 font-semibold inline-flex items-center space-x-1"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5 text-forest-700" />
                        </Link>
                        <button
                          onClick={() => handleOpenDetail(ord)}
                          className="px-3 py-1.5 rounded-lg bg-forest-800 text-white font-semibold hover:bg-forest-900 transition-colors inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Order Detail & Price Confirmation Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-borderCream shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-borderCream">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
                  {OFFICIAL_STORE_NAME} Order Management
                </span>
                <h3 className="font-serif text-2xl font-bold text-forest-800">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-muted hover:text-forest-800 hover:bg-cream-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cancellation Request Warning */}
            {selectedOrder.cancellationRequested && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-1">
                <span className="font-bold flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Customer Requested Cancellation:</span>
                </span>
                <p className="text-red-800">
                  {selectedOrder.cancellationReason || 'No specific reason given by customer.'}
                </p>
              </div>
            )}

            {message && (
              <div className="p-3 rounded-xl bg-forest-100 text-forest-900 font-medium text-xs">
                {message}
              </div>
            )}

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-cream-100/70 text-xs">
              <div>
                <span className="font-bold text-forest-800 block">Customer</span>
                <p className="text-muted">{selectedOrder.customerName}</p>
                <p className="text-muted">Calling: {selectedOrder.customerPhone}</p>
                <p className="text-muted">WhatsApp: {selectedOrder.customerWhatsapp}</p>
              </div>

              <div>
                <span className="font-bold text-forest-800 block">Delivery Location</span>
                <p className="text-muted">{selectedOrder.area}, {selectedOrder.city}</p>
                <p className="text-muted">{selectedOrder.deliveryAddress}</p>
                {selectedOrder.deliveryInstructions && (
                  <p className="text-gold-800 font-medium mt-1">
                    Note: {selectedOrder.deliveryInstructions}
                  </p>
                )}
              </div>
            </div>

            {/* Item Pricing & Confirmation Section */}
            <div className="space-y-3">
              <h4 className="font-serif text-base font-bold text-forest-800">
                Confirm Item Prices & Snapshot
              </h4>
              <p className="text-[11px] text-muted">
                Admin can set or modify the unit price for any product in this order. Final total recalculates automatically.
              </p>

              <div className="border border-borderCream rounded-2xl divide-y divide-borderCream/60 overflow-hidden bg-white text-xs">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 border border-borderCream shadow-xs">
                        <img
                          src={item.product?.imageUrl || '/products/cow-milk.jpg'}
                          alt={item.productNameSnapshot}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/products/cow-milk.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-forest-800 block truncate">
                          {item.productNameSnapshot}
                        </span>
                        <span className="text-muted text-[11px]">
                          Size: {item.selectedVariant} | Qty: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-muted">Unit Rs:</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={editingPrices[item.id] ?? ''}
                        onChange={(e) =>
                          setEditingPrices({
                            ...editingPrices,
                            [item.id]: e.target.value,
                          })
                        }
                        className="w-24 px-2.5 py-1.5 rounded-lg border border-borderCream bg-cream-50 font-serif font-bold text-forest-800 text-right focus:outline-none focus:ring-1 focus:ring-forest-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Admin Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                  Update Order Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white text-xs font-bold text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                  Admin Internal Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Confirmed with customer over call"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>
            </div>

            {/* Quick Links inside modal */}
            <div className="flex items-center justify-between text-xs pt-2">
              <Link
                href={`/order-confirmation/${selectedOrder.orderNumber}/invoice`}
                target="_blank"
                className="text-forest-800 hover:text-gold-700 font-bold underline flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Open Printable Official Invoice</span>
              </Link>
              <Link
                href={`/track?order=${selectedOrder.orderNumber}`}
                target="_blank"
                className="text-forest-800 hover:text-gold-700 font-bold underline flex items-center space-x-1"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Customer Tracking View</span>
              </Link>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-borderCream">
              <a
                href={getWhatsAppUrl(
                  `Hello ${selectedOrder.customerName}! This is ${OFFICIAL_STORE_NAME} dispatch regarding order #${selectedOrder.orderNumber}. We have verified your morning batch!`,
                  selectedOrder.customerWhatsapp
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-forest-800/40 text-forest-800 font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-cream-100"
              >
                <MessageSquare className="w-4 h-4 text-forest-700" />
                <span>Message Customer on WhatsApp</span>
              </a>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-borderCream text-xs font-semibold text-muted hover:text-forest-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveOrderUpdate}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
