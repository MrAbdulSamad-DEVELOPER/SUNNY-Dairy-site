'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertCircle, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    confirmedSubtotal,
    hasPendingPriceItems,
    pendingItemCount,
    totalItemCount,
  } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-center justify-between pb-6 border-b border-borderCream">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            Shopping Basket
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
            Your Order Items
          </h1>
        </div>
        <Link
          href="/shop"
          className="text-xs sm:text-sm font-semibold text-forest-800 hover:text-gold-700 flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-[#FFFDFA] rounded-3xl border border-borderCream mt-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-forest-800/40">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-800">Your basket is currently empty</h2>
          <p className="text-sm text-muted max-w-sm mx-auto">
            Choose from our farm fresh cow milk, goat milk, dahi, pure makhan, or traditional sweets.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex px-8 py-3 bg-forest-800 hover:bg-forest-900 text-white font-semibold rounded-full text-sm shadow-md transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#FFFDFA] rounded-3xl p-6 border border-borderCream space-y-4 shadow-sm">
              {items.map((item) => {
                const isConfirmed = item.priceType === 'CONFIRMED' && item.price !== null;
                const lineTotal = isConfirmed ? item.price! * item.quantity : null;

                return (
                  <div
                    key={`${item.productId}-${item.selectedVariant}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-cream-50/50 border border-borderCream/70 gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-forest-800">
                          {item.productName}
                        </h3>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 inline-block mt-1">
                          {item.selectedVariant}
                        </span>
                        <div className="text-xs text-muted mt-1">
                          {isConfirmed ? (
                            <span>Unit: Rs {item.price?.toLocaleString()}</span>
                          ) : (
                            <span className="text-gold-700 font-medium">Price on request</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-borderCream/60">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-borderCream rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.selectedVariant, item.quantity - 1)
                          }
                          className="p-1 px-2.5 text-forest-800 hover:bg-cream-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-forest-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.selectedVariant, item.quantity + 1)
                          }
                          className="p-1 px-2.5 text-forest-800 hover:bg-cream-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right min-w-[100px]">
                        {isConfirmed ? (
                          <span className="font-serif text-lg font-bold text-forest-800">
                            Rs {lineTotal?.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-2 py-1 rounded">
                            To be confirmed
                          </span>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.productId, item.selectedVariant)}
                        className="text-muted hover:text-red-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream space-y-6 shadow-sm sticky top-28">
              <h3 className="font-serif text-xl font-bold text-forest-800 pb-3 border-b border-borderCream">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Total items:</span>
                  <span className="font-semibold text-forest-800">{totalItemCount}</span>
                </div>

                <div className="flex justify-between items-center text-base">
                  <span className="font-medium text-forest-800">Confirmed Subtotal:</span>
                  <span className="font-serif font-bold text-forest-800 text-xl">
                    Rs {confirmedSubtotal.toLocaleString()}
                  </span>
                </div>

                {hasPendingPriceItems && (
                  <div className="p-3.5 rounded-2xl bg-gold-50 border border-gold-200 text-xs text-forest-900 space-y-1.5">
                    <div className="flex items-center space-x-1.5 font-bold text-gold-800">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{pendingItemCount} item(s) pending price confirmation</span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Products without fixed public prices (fresh daily milk, dahi & sweets) will be confirmed with you directly on WhatsApp before dispatch.
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-muted pt-2 border-t border-borderCream">
                  <span>Delivery method:</span>
                  <span className="font-semibold text-forest-800">Cash on Delivery</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center space-x-2 bg-forest-800 hover:bg-forest-900 text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </Link>
              </div>

              <div className="text-[11px] text-muted text-center leading-relaxed">
                No credit card required. You pay cash or bank transfer only upon inspecting your fresh delivery.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
