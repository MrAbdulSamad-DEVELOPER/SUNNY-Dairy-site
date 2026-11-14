'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  FileText,
  AlertTriangle,
  Download,
  Building,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

interface PaymentItem {
  id: string;
  orderId: string;
  paymentMethod: string;
  amount: number;
  senderName: string | null;
  transactionReference: string | null;
  receiptImageUrl: string | null;
  paymentStatus: string;
  verificationTimestamp: string | null;
  verifiedBy: string | null;
  adminNotes: string | null;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerWhatsapp: string | null;
    finalTotal: number | null;
    subtotal: number;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
  };
}

export default function PaymentsManager() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      if (search.trim()) params.append('search', search.trim());
      params.append('_t', String(Date.now()));

      const res = await fetch(`/api/admin/payments?${params.toString()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      if (!res.ok) throw new Error('Failed to fetch payments');
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (e: any) {
      console.error(e);
      setStatusMessage({ type: 'error', text: 'Failed to load payments from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleUpdateStatus = async (paymentId: string, newStatus: 'VERIFIED' | 'REJECTED' | 'UNDER_VERIFICATION') => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: newStatus,
          adminNotes: actionNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update payment status');

      setStatusMessage({
        type: 'success',
        text: `Payment marked as ${newStatus} successfully. Order status updated.`,
      });
      setSelectedPayment(null);
      setActionNotes('');
      fetchPayments();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Verified
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Rejected
          </span>
        );
      case 'UNDER_VERIFICATION':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Under Verification
          </span>
        );
      case 'PAYMENT_SUBMITTED':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Payment Submitted
          </span>
        );
    }
  };

  // Metrics
  const totalSubmissions = payments.length;
  const pendingReviewCount = payments.filter(
    (p) => p.paymentStatus === 'PAYMENT_SUBMITTED' || p.paymentStatus === 'UNDER_VERIFICATION'
  ).length;
  const verifiedCount = payments.filter((p) => p.paymentStatus === 'VERIFIED').length;
  const verifiedAmount = payments
    .filter((p) => p.paymentStatus === 'VERIFIED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-borderCream">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-forest-900 tracking-tight">
            Bank Payments
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Review customer UBL bank transfers, inspect receipts, and verify payments manually.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center space-x-1.5 bg-white hover:bg-cream-100 text-forest-800 border border-borderCream px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-forest-800' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-borderCream shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Total Submissions</span>
            <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-serif font-bold text-forest-800">{totalSubmissions}</div>
          <span className="text-xs text-muted mt-0.5 block">Advance payment records</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Needs Review</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-serif font-bold text-amber-900">{pendingReviewCount}</div>
          <span className="text-xs text-amber-700 mt-0.5 block">Awaiting bank verification</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Verified</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-serif font-bold text-emerald-900">{verifiedCount}</div>
          <span className="text-xs text-emerald-700 mt-0.5 block">Manually confirmed by admin</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-borderCream shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Verified Volume</span>
            <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-serif font-bold text-forest-800">
            Rs {verifiedAmount.toLocaleString()}
          </div>
          <span className="text-xs text-muted mt-0.5 block">Actual received revenue</span>
        </div>
      </div>

      {/* Status Message Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-sm font-semibold">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold uppercase hover:underline opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-borderCream shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-cream-100 rounded-xl">
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Needs Review', value: 'PAYMENT_SUBMITTED' },
            { label: 'Under Verification', value: 'UNDER_VERIFICATION' },
            { label: 'Verified', value: 'VERIFIED' },
            { label: 'Rejected', value: 'REJECTED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === tab.value
                  ? 'bg-white text-forest-800 shadow-sm'
                  : 'text-muted hover:text-forest-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order #, sender, TID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-borderCream bg-cream-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-forest-800 text-cream-100 text-sm font-semibold rounded-xl hover:bg-forest-900 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Payments Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-borderCream shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-forest-800" />
            <p className="text-sm font-semibold">Loading payment submissions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted/50" />
            <h3 className="text-base font-bold text-forest-900">No payment submissions found</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mt-1">
              When customers complete checkout with Advance UBL Bank Transfer, their receipts and details appear here for verification.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card List View (< 768px) */}
            <div className="block md:hidden divide-y divide-borderCream/70">
              {payments.map((p) => {
                const dateStr = new Date(p.createdAt).toLocaleDateString('en-PK', {
                  day: 'numeric',
                  month: 'short',
                });
                const timeStr = new Date(p.createdAt).toLocaleTimeString('en-PK', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={p.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-forest-900 text-sm">
                            #{p.order.orderNumber}
                          </span>
                          <span className="text-[11px] text-muted">· {dateStr} {timeStr}</span>
                        </div>
                        <h4 className="font-bold text-forest-900 text-xs mt-0.5">
                          {p.order.customerName} ({p.order.customerPhone})
                        </h4>
                      </div>

                      <div className="flex-shrink-0">
                        {getStatusBadge(p.paymentStatus)}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-cream-50/70 border border-borderCream/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted text-[11px]">Amount Paid:</span>
                        <strong className="text-forest-900 text-sm">Rs {p.amount.toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted">Sender:</span>
                        <span className="font-semibold text-forest-800">{p.senderName || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted">TID / Ref:</span>
                        <span className="font-mono text-forest-800">{p.transactionReference || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-2">
                      {p.receiptImageUrl ? (
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setActionNotes(p.adminNotes || '');
                          }}
                          className="px-3 py-1.5 rounded-lg border border-borderCream bg-white hover:bg-cream-100 text-xs font-semibold text-forest-800 inline-flex items-center space-x-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-forest-800" />
                          <span>View Slip</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted italic">No Slip</span>
                      )}

                      <div className="flex items-center space-x-1.5">
                        {p.paymentStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'VERIFIED')}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setActionNotes(p.adminNotes || '');
                          }}
                          className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-forest-800 border border-borderCream rounded-lg text-xs font-semibold transition-colors"
                        >
                          <span>Manage</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100/70 border-b border-borderCream text-xs font-bold text-forest-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Order #</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Sender / TID</th>
                    <th className="py-3.5 px-4 text-center">Receipt</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Verification</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderCream">
                  {payments.map((p) => {
                    const dateStr = new Date(p.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });
                    const timeStr = new Date(p.createdAt).toLocaleTimeString('en-PK', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                        <td className="py-4 px-4 text-xs">
                          <span className="font-semibold text-forest-800 block">{dateStr}</span>
                          <span className="text-muted text-[11px]">{timeStr}</span>
                        </td>

                        <td className="py-4 px-4 font-mono text-xs font-bold">
                          <Link
                            href={`/admin/orders`}
                            className="text-forest-800 hover:text-gold-600 transition-colors flex items-center space-x-1"
                          >
                            <span>{p.order.orderNumber}</span>
                            <ExternalLink className="w-3 h-3 text-muted" />
                          </Link>
                        </td>

                        <td className="py-4 px-4 text-xs">
                          <span className="font-bold text-forest-800 block">{p.order.customerName}</span>
                          <span className="text-muted text-[11px]">{p.order.customerPhone}</span>
                        </td>

                        <td className="py-4 px-4 font-bold text-forest-800">
                          Rs {p.amount.toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-xs">
                          <span className="font-semibold text-forest-800 block">
                            {p.senderName || 'Not specified'}
                          </span>
                          <span className="font-mono text-muted text-[11px] block mt-0.5">
                            TID: {p.transactionReference || 'N/A'}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          {p.receiptImageUrl ? (
                            <button
                              onClick={() => {
                                setSelectedPayment(p);
                                actionNotes;
                                setSelectedPayment(p);
                                setActionNotes(p.adminNotes || '');
                              }}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-borderCream hover:border-forest-800 bg-white text-xs font-semibold text-forest-800 transition-all shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5 text-forest-800" />
                              <span>View</span>
                            </button>
                          ) : (
                            <span className="text-xs text-muted italic">No receipt</span>
                          )}
                        </td>

                        <td className="py-4 px-4">{getStatusBadge(p.paymentStatus)}</td>

                        <td className="py-4 px-4 text-xs">
                          {p.verifiedBy ? (
                            <div>
                              <span className="font-semibold text-forest-800 block">
                                By: {p.verifiedBy}
                              </span>
                              {p.verificationTimestamp && (
                                <span className="text-[11px] text-muted">
                                  {new Date(p.verificationTimestamp).toLocaleDateString('en-PK', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted text-[11px] italic">Pending</span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {p.paymentStatus !== 'VERIFIED' && (
                              <button
                                onClick={() => handleUpdateStatus(p.id, 'VERIFIED')}
                                disabled={isProcessing}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 shadow-sm"
                                title="Mark as Verified (Confirm payment in UBL account)"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Verify</span>
                              </button>
                            )}

                            {p.paymentStatus !== 'REJECTED' && (
                              <button
                                onClick={() => {
                                  setSelectedPayment(p);
                                  setActionNotes(p.adminNotes || '');
                                }}
                                className="px-2.5 py-1 bg-cream-100 hover:bg-rose-50 text-rose-700 border border-borderCream rounded-lg text-xs font-bold transition-colors"
                                title="Review & Reject"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Reject</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Receipt Inspection & Verification Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-borderCream shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-forest-900 text-cream-100 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block">
                  Advance UBL Bank Transfer Verification
                </span>
                <h3 className="font-serif text-xl font-bold mt-0.5">
                  Order {selectedPayment.order.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1 rounded-xl text-cream-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-cream-50/70 rounded-2xl border border-borderCream text-xs">
                <div>
                  <span className="text-muted block text-[11px]">Payable Amount</span>
                  <span className="font-bold text-forest-800 text-sm">
                    Rs {selectedPayment.amount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Customer</span>
                  <span className="font-bold text-forest-800">{selectedPayment.order.customerName}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Sender Name</span>
                  <span className="font-bold text-forest-800">{selectedPayment.senderName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Transaction ID</span>
                  <span className="font-mono font-bold text-forest-800">
                    {selectedPayment.transactionReference || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Receipt Image / PDF Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                    Customer Submitted Receipt Screenshot
                  </span>
                  {selectedPayment.receiptImageUrl && (
                    <a
                      href={selectedPayment.receiptImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-forest-800 hover:text-gold-600 flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Open Full Size</span>
                    </a>
                  )}
                </div>

                <div className="relative w-full max-h-96 min-h-[220px] bg-cream-100 rounded-2xl border border-borderCream flex items-center justify-center overflow-hidden">
                  {selectedPayment.receiptImageUrl ? (
                    selectedPayment.receiptImageUrl.endsWith('.pdf') ? (
                      <div className="p-8 text-center">
                        <FileText className="w-12 h-12 text-forest-800 mx-auto mb-2" />
                        <p className="text-sm font-bold text-forest-800">PDF Receipt Document</p>
                        <a
                          href={selectedPayment.receiptImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block px-4 py-2 bg-forest-800 text-cream-100 rounded-xl text-xs font-bold hover:bg-forest-900 transition-colors"
                        >
                          View PDF in new tab
                        </a>
                      </div>
                    ) : (
                      <img
                        src={selectedPayment.receiptImageUrl}
                        alt="Bank transfer receipt"
                        className="max-h-96 w-auto object-contain rounded-xl"
                      />
                    )
                  ) : (
                    <p className="text-xs text-muted italic">No receipt file uploaded</p>
                  )}
                </div>
              </div>

              {/* Bank Verification Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="font-bold">Owner Verification Policy:</strong> Check your actual United Bank Limited (UBL) statement for Account <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">236525896</code>. Never mark an order as paid without matching the incoming funds.
                </p>
              </div>

              {/* Admin Internal Notes */}
              <div>
                <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                  Admin Internal Notes / Rejection Reason
                </label>
                <textarea
                  rows={2}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g. Verified against UBL mobile banking at 11:15 AM, or funds not reflected in account."
                  className="w-full px-4 py-2 text-sm rounded-xl border border-borderCream bg-cream-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-borderCream">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-borderCream text-sm font-semibold text-muted hover:text-forest-800 transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedPayment.id, 'REJECTED')}
                    disabled={isProcessing}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    Reject Payment
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedPayment.id, 'VERIFIED')}
                    disabled={isProcessing}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    Verify & Mark Order Paid
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
