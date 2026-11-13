'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormValues } from '@/lib/validations';
import { useCart } from '@/lib/cart-context';
import {
  ShieldCheck,
  Building2,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  X,
  Copy,
  Check,
  UploadCloud,
  FileCheck,
  Clock,
} from 'lucide-react';
import {
  OFFICIAL_STORE_NAME,
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_UBL_BANK_NAME,
  OFFICIAL_UBL_ACCOUNT_NUMBER,
  OFFICIAL_UBL_ACCOUNT_TITLE,
  getWhatsAppUrl,
} from '@/lib/whatsapp';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, confirmedSubtotal, hasPendingPriceItems, pendingItemCount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Receipt upload state
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [receiptUploadError, setReceiptUploadError] = useState<string | null>(null);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Delivery zone state
  const [estimatedDeliveryFee, setEstimatedDeliveryFee] = useState<number>(0);

  // Dynamic Bank Details state from DB settings
  const [bankDetails, setBankDetails] = useState({
    bankName: OFFICIAL_UBL_BANK_NAME,
    accountNumber: OFFICIAL_UBL_ACCOUNT_NUMBER,
    accountTitle: OFFICIAL_UBL_ACCOUNT_TITLE,
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setBankDetails({
            bankName: data.settings.ubl_bank_name || OFFICIAL_UBL_BANK_NAME,
            accountNumber: data.settings.ubl_account_number || OFFICIAL_UBL_ACCOUNT_NUMBER,
            accountTitle: data.settings.ubl_account_title || OFFICIAL_UBL_ACCOUNT_TITLE,
          });
        }
      })
      .catch(console.warn);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerWhatsapp: '',
      deliveryAddress: '',
      city: 'Dera Ismail Khan',
      area: '',
      deliveryInstructions: '',
      paymentMethod: 'ADVANCE_UBL',
      senderName: '',
      transactionReference: '',
      receiptImageUrl: null,
      items: items.map((i) => ({
        productId: i.productId,
        selectedVariant: i.selectedVariant,
        quantity: i.quantity,
      })),
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');
  const selectedArea = watch('area');

  // Delivery fee logic
  useEffect(() => {
    if (confirmedSubtotal >= 3000) {
      setEstimatedDeliveryFee(0);
    } else {
      setEstimatedDeliveryFee(100);
    }
  }, [confirmedSubtotal, selectedArea]);

  // Sync form items if cart changes
  useEffect(() => {
    setValue(
      'items',
      items.map((i) => ({
        productId: i.productId,
        selectedVariant: i.selectedVariant,
        quantity: i.quantity,
      }))
    );
  }, [items, setValue]);

  // Handle Copy Bank Account
  const handleCopyAccount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bankDetails.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2500);
    }
  };

  // Handle Receipt Upload
  const handleReceiptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingReceipt(true);
    setReceiptUploadError(null);

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const res = await fetch('/api/payments/upload-receipt', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload receipt');
      }

      setUploadedReceiptUrl(data.url);
      setValue('receiptImageUrl', data.url);
    } catch (err: any) {
      setReceiptUploadError(err.message || 'Error uploading receipt');
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const calculatedGrandTotal = Math.max(0, confirmedSubtotal + estimatedDeliveryFee);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      setServerError('Your cart is empty. Please add items to checkout.');
      return;
    }

    // Client-side guard for Advance Payment
    if (data.paymentMethod === 'ADVANCE_UBL') {
      if (!data.senderName || !data.senderName.trim()) {
        setServerError('Please enter the sender bank account name for UBL transfer verification.');
        return;
      }
      if (!data.transactionReference || !data.transactionReference.trim()) {
        setServerError('Please enter the transaction reference / TID number.');
        return;
      }
      if (!data.receiptImageUrl) {
        setServerError('Please upload a screenshot or photo of your UBL transfer receipt.');
        return;
      }
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit order');
      }

      // If user chose DIRECT_WHATSAPP, generate WhatsApp link
      if (data.paymentMethod === 'DIRECT_WHATSAPP') {
        const orderSummaryLines = items.map(
          (i) => `• ${i.productName} (${i.selectedVariant}) x ${i.quantity} = Rs ${((i.price || 0) * i.quantity).toLocaleString()}`
        );
        const waMessage =
          `Assalam-o-Alaikum SUNNY Dairy!%0A%0A` +
          `I would like to place an order:%0A` +
          `*Order #:* ${result.order.orderNumber}%0A` +
          `*Customer:* ${data.customerName}%0A` +
          `*Phone:* ${data.customerPhone}%0A` +
          `*Delivery Address:* ${data.deliveryAddress}, ${data.area}, ${data.city}%0A%0A` +
          `*Items:*%0A${orderSummaryLines.join('%0A')}%0A%0A` +
          `*Total Payable:* Rs ${calculatedGrandTotal.toLocaleString()}%0A` +
          `*Payment Method:* Direct WhatsApp Order%0A%0A` +
          `Please confirm batch availability for delivery in ${data.city || 'Pakistan'}.`;

        const waUrl = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${waMessage}`;

        // Clear cart first
        clearCart();

        // Open WhatsApp in new tab
        window.open(waUrl, '_blank');

        // Redirect customer to the confirmation page
        router.push(`/order-confirmation/${result.order.orderNumber}`);
      } else {
        // ADVANCE_UBL
        clearCart();
        router.push(`/order-confirmation/${result.order.orderNumber}`);
      }
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-forest-800">Your Basket is Empty</h1>
        <p className="text-sm text-muted">
          Please select fresh dairy products before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-forest-800 text-white rounded-xl font-semibold text-sm hover:bg-forest-900 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="pb-8 border-b border-borderCream">
        <Link
          href="/cart"
          className="text-xs sm:text-sm font-semibold text-muted hover:text-forest-800 flex items-center space-x-1.5 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Basket</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          {OFFICIAL_STORE_NAME} Direct Farm Order
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
          Checkout & Delivery Details
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Delivering fresh dairy & traditional sweets all over Pakistan.
        </p>
      </div>

      {serverError && (
        <div className="my-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Customer & Delivery & Payment Info */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Details */}
          <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream space-y-5 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-forest-800 pb-2 border-b border-borderCream">
              1. Customer Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Usman"
                  {...register('customerName')}
                  className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                {errors.customerName && (
                  <p className="text-red-600 text-xs mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                    Phone Number (Calling) *
                  </label>
                  <input
                    type="text"
                    placeholder="0300 1234567"
                    {...register('customerPhone')}
                    className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                  {errors.customerPhone && (
                    <p className="text-red-600 text-xs mt-1">{errors.customerPhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                    WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    placeholder="0300 1234567"
                    {...register('customerWhatsapp')}
                    className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                  {errors.customerWhatsapp && (
                    <p className="text-red-600 text-xs mt-1">{errors.customerWhatsapp.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream space-y-5 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-forest-800 pb-2 border-b border-borderCream">
              2. Delivery Address (All Over Pakistan)
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dera Ismail Khan, Lahore, Islamabad, Karachi"
                    {...register('city')}
                    className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-forest-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
                  )}
                  <span className="text-[11px] text-muted block mt-1">
                    Delivering fresh dairy & traditional sweets all over Pakistan
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                    Area / Sector / Colony *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cantt, University Road, Circular Road, Qayyum Nagar"
                    {...register('area')}
                    className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                  {errors.area && (
                    <p className="text-red-600 text-xs mt-1">{errors.area.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                  Complete Street Address *
                </label>
                <textarea
                  rows={3}
                  placeholder="House / Apartment number, Street / Lane, Landmark"
                  {...register('deliveryAddress')}
                  className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                {errors.deliveryAddress && (
                  <p className="text-red-600 text-xs mt-1">{errors.deliveryAddress.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                  Optional Delivery Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ring bell twice, deliver between 8 AM - 9 AM"
                  {...register('deliveryInstructions')}
                  className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection (Exactly Two Options) */}
          <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream space-y-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-forest-800 pb-2 border-b border-borderCream">
              3. Payment Method
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {/* Option 1: Advance Payment (UBL Bank Transfer) */}
              <label
                className={`relative flex items-start p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPaymentMethod === 'ADVANCE_UBL'
                    ? 'border-forest-800 bg-forest-50/30 shadow-sm ring-1 ring-forest-800'
                    : 'border-borderCream hover:border-forest-400 bg-white'
                }`}
              >
                <input
                  type="radio"
                  value="ADVANCE_UBL"
                  {...register('paymentMethod')}
                  className="mt-1 mr-3.5 text-forest-800 focus:ring-forest-800 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-forest-800" />
                    <span className="font-serif font-bold text-forest-800 text-base">
                      Advance Payment — UBL Bank Transfer
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Transfer directly to our official United Bank Limited (UBL) account and upload your receipt screenshot for admin verification.
                  </p>
                </div>
              </label>

              {/* Option 2: Direct WhatsApp Order */}
              <label
                className={`relative flex items-start p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPaymentMethod === 'DIRECT_WHATSAPP'
                    ? 'border-forest-800 bg-forest-50/30 shadow-sm ring-1 ring-forest-800'
                    : 'border-borderCream hover:border-forest-400 bg-white'
                }`}
              >
                <input
                  type="radio"
                  value="DIRECT_WHATSAPP"
                  {...register('paymentMethod')}
                  className="mt-1 mr-3.5 text-forest-800 focus:ring-forest-800 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-emerald-700" />
                    <span className="font-serif font-bold text-forest-800 text-base">
                      Direct WhatsApp Order
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Order directly with farm owner Sanaullah on official WhatsApp ({OFFICIAL_WHATSAPP_NUMBER}) with your order prefilled.
                  </p>
                </div>
              </label>
            </div>

            {/* DYNAMIC PAYMENT INSTRUCTIONS */}

            {/* If Option 1: ADVANCE_UBL is selected */}
            {selectedPaymentMethod === 'ADVANCE_UBL' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-amber-900" />
                  <h3 className="font-serif text-base font-bold text-amber-950">
                    Official UBL Bank Account Details
                  </h3>
                </div>

                {/* Bank Account Details Card */}
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-muted block text-[11px] uppercase font-bold">Bank</span>
                      <span className="font-bold text-forest-800 text-sm">{bankDetails.bankName}</span>
                    </div>

                    <div>
                      <span className="text-muted block text-[11px] uppercase font-bold">Account Title</span>
                      <span className="font-bold text-forest-800 text-sm">{bankDetails.accountTitle}</span>
                    </div>

                    <div>
                      <span className="text-muted block text-[11px] uppercase font-bold">Account / Bank Number</span>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="font-mono font-bold text-base text-forest-900 tracking-wider">
                          {bankDetails.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="px-2 py-1 rounded bg-cream-100 hover:bg-cream-200 text-forest-800 text-xs font-semibold flex items-center space-x-1 border border-borderCream transition-colors"
                          title="Copy Account Number"
                        >
                          {copiedAccount ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-muted" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-borderCream/60 flex items-center justify-between text-xs">
                    <span className="text-muted">Payable Transfer Amount:</span>
                    <span className="font-serif font-bold text-forest-900 text-base">
                      Rs {calculatedGrandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-xs text-amber-950/80 space-y-1">
                  <p className="font-semibold text-amber-950">Instructions:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Transfer <strong>Rs {calculatedGrandTotal.toLocaleString()}</strong> to the UBL account number above.</li>
                    <li>Enter the Sender Account Name and Transaction Reference (TID).</li>
                    <li>Upload a clear screenshot or photo of the payment receipt.</li>
                    <li>Submit your order. Our admin will manually verify against bank records before dispatch.</li>
                  </ol>
                </div>

                {/* Input Fields for Advance Payment */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                        Sender Account Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Muhammad Usman"
                        {...register('senderName')}
                        className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                        Transaction Reference / TID *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UBL-9481230491 or TID# 49102"
                        {...register('transactionReference')}
                        className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest-800"
                      />
                    </div>
                  </div>

                  {/* Receipt File Upload */}
                  <div>
                    <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                      Upload Payment Receipt / Screenshot *
                    </label>

                    <div className="border-2 border-dashed border-amber-300 rounded-2xl p-4 bg-white text-center hover:bg-amber-50/30 transition-colors">
                      {uploadedReceiptUrl ? (
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                          <div className="flex items-center space-x-3">
                            <FileCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                            <div className="text-left">
                              <span className="font-semibold text-xs text-emerald-900 block">
                                Receipt Screenshot Uploaded
                              </span>
                              <span className="text-[11px] text-muted">Ready for admin verification</span>
                            </div>
                          </div>

                          <a
                            href={uploadedReceiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-emerald-700 hover:underline"
                          >
                            Preview
                          </a>
                        </div>
                      ) : (
                        <div>
                          <UploadCloud className="w-8 h-8 mx-auto text-amber-700 mb-2" />
                          <p className="text-xs font-semibold text-forest-800">
                            Upload receipt image (JPG, PNG, WEBP, or PDF up to 5MB)
                          </p>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,application/pdf"
                            onChange={handleReceiptFileChange}
                            disabled={isUploadingReceipt}
                            className="mt-2 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-800 file:text-white hover:file:bg-forest-900 cursor-pointer"
                          />
                        </div>
                      )}

                      {isUploadingReceipt && (
                        <p className="text-xs text-amber-800 mt-2 font-semibold animate-pulse">
                          Uploading receipt securely...
                        </p>
                      )}

                      {receiptUploadError && (
                        <p className="text-xs text-red-600 mt-2">{receiptUploadError}</p>
                      )}
                    </div>
                  </div>

                  {/* Verification Notice */}
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Important:</strong> Uploading a receipt screenshot does not automatically mark your order as paid. Our team manually checks the incoming bank statement before confirming.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* If Option 2: DIRECT_WHATSAPP is selected */}
            {selectedPaymentMethod === 'DIRECT_WHATSAPP' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-serif text-base font-bold text-emerald-950">
                    Official WhatsApp Order Confirmation
                  </h3>
                </div>

                <p className="text-xs text-emerald-950 leading-relaxed">
                  When you submit your order, your details will be securely saved in our store database. You will immediately be directed to WhatsApp (<strong>+{OFFICIAL_WHATSAPP_NUMBER}</strong>) with your full order summary prefilled to confirm with Sanaullah.
                </p>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold block">WhatsApp Business Contact:</span>
                  <a
                    href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-emerald-800 hover:underline block text-sm"
                  >
                    https://wa.me/{OFFICIAL_WHATSAPP_NUMBER}
                  </a>
                </div>

                <div className="text-[11px] text-muted italic">
                  Note: Please send the generated WhatsApp message once the app opens so our farm staff can schedule your delivery.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary: Order Items & Submit */}
        <div className="lg:col-span-5">
          <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream space-y-6 shadow-sm sticky top-28">
            <h3 className="font-serif text-xl font-bold text-forest-800 pb-3 border-b border-borderCream">
              Items in this Order
            </h3>

            {/* Item Mini List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => {
                const isConfirmed = item.priceType === 'CONFIRMED' && item.price !== null;
                return (
                  <div
                    key={`${item.productId}-${item.selectedVariant}`}
                    className="flex items-center justify-between text-xs py-2 border-b border-borderCream/40"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                        <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-forest-800 block line-clamp-1">
                          {item.productName}
                        </span>
                        <span className="text-muted">
                          {item.selectedVariant} × {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {isConfirmed ? (
                        <span className="font-bold text-forest-800">
                          Rs {(item.price! * item.quantity).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gold-700 font-semibold bg-gold-50 px-1.5 py-0.5 rounded">
                          Price on Request
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-2 text-sm border-t border-borderCream">
              <div className="flex justify-between items-center text-muted text-xs">
                <span>Confirmed subtotal:</span>
                <span className="font-bold text-forest-800">
                  Rs {confirmedSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-muted text-xs">
                <span>Cold-Chain Delivery:</span>
                <span className="font-bold text-forest-800">
                  {estimatedDeliveryFee === 0 ? (
                    <span className="text-emerald-700">FREE</span>
                  ) : (
                    `Rs ${estimatedDeliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-borderCream flex justify-between items-center text-forest-800">
                <span className="font-bold">Total Payable:</span>
                <span className="font-serif font-bold text-xl text-forest-900">
                  Rs {calculatedGrandTotal.toLocaleString()}
                </span>
              </div>

              {hasPendingPriceItems && (
                <div className="p-3 rounded-2xl bg-gold-50 border border-gold-200 text-xs text-forest-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-gold-800">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{pendingItemCount} item(s) require morning batch price check</span>
                  </div>
                  <p className="text-[11px] text-muted">
                    Exact prices will be confirmed with you via WhatsApp prior to rider departure.
                  </p>
                </div>
              )}

              <div className="flex justify-between text-xs text-muted pt-1">
                <span>Estimated Delivery Window:</span>
                <span className="font-semibold text-forest-800">Tomorrow Morning (7am-11:30am)</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || (selectedPaymentMethod === 'ADVANCE_UBL' && isUploadingReceipt)}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all shadow-md ${
                isSubmitting
                  ? 'bg-forest-700 text-forest-200 cursor-wait'
                  : selectedPaymentMethod === 'ADVANCE_UBL'
                  ? 'bg-gold-500 hover:bg-gold-600 text-forest-950 active:scale-[0.99]'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <span>Recording your farm order...</span>
              ) : selectedPaymentMethod === 'ADVANCE_UBL' ? (
                <span>Submit Order with Bank Receipt</span>
              ) : (
                <span>Place Order & Continue to WhatsApp</span>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-xs text-muted text-center pt-1">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              <span>Safe farm cold-chain guarantee · All Over Pakistan</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
