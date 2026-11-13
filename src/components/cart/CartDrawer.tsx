'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    confirmedSubtotal,
    hasPendingPriceItems,
    pendingItemCount,
    totalItemCount,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDFA] shadow-2xl flex flex-col border-l border-borderCream">
          {/* Header */}
          <div className="p-6 border-b border-borderCream flex items-center justify-between bg-cream-50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-forest-800" />
              <h2 className="font-serif text-xl font-bold text-forest-800">Your Basket</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-800 text-white">
                {totalItemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-muted hover:text-forest-800 hover:bg-cream-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-forest-800/40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg font-bold text-forest-800">Your cart is empty</p>
                  <p className="text-sm text-muted">
                    Explore our fresh milk, artisanal butter and sweets.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 bg-forest-800 text-cream-50 rounded-xl text-sm font-semibold hover:bg-forest-900 transition-colors"
                >
                  Browse Farm Shop
                </button>
              </div>
            ) : (
              items.map((item) => {
                const isConfirmed = item.priceType === 'CONFIRMED' && item.price !== null;
                const itemTotal = isConfirmed ? item.price! * item.quantity : null;

                return (
                  <div
                    key={`${item.productId}-${item.selectedVariant}`}
                    className="flex space-x-4 p-3.5 rounded-2xl bg-cream-50/60 border border-borderCream/70 hover:border-forest-600/30 transition-colors"
                  >
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif text-base font-bold text-forest-800 line-clamp-1">
                            {item.productName}
                          </h4>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-forest-100 text-forest-800 inline-block mt-0.5">
                            {item.selectedVariant}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.selectedVariant)}
                          className="text-muted hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-borderCream rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.selectedVariant, item.quantity - 1)
                            }
                            className="p-1 px-2 text-forest-800 hover:bg-cream-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-forest-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.selectedVariant, item.quantity + 1)
                            }
                            className="p-1 px-2 text-forest-800 hover:bg-cream-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {isConfirmed ? (
                            <span className="font-serif text-sm font-bold text-forest-800">
                              Rs {itemTotal?.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-2 py-0.5 rounded">
                              Price to be confirmed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="p-6 border-t border-borderCream bg-cream-50 space-y-4">
              {/* Pricing breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-forest-800">
                  <span className="font-medium">Confirmed items subtotal:</span>
                  <span className="font-serif font-bold text-lg">
                    Rs {confirmedSubtotal.toLocaleString()}
                  </span>
                </div>

                {hasPendingPriceItems && (
                  <div className="p-3 rounded-xl bg-gold-50 border border-gold-200 text-xs text-forest-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-gold-800">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{pendingItemCount} item(s) pending price confirmation</span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Prices for daily milk, sweets or custom sizes will be confirmed directly on WhatsApp or call before dispatch.
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-xs text-muted pt-1">
                  <span>Delivery in Dera Ismail Khan:</span>
                  <span className="font-medium text-forest-800">Cash on delivery</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-forest-800 hover:bg-forest-900 text-white py-3.5 px-4 rounded-xl font-semibold shadow-md active:scale-[0.99] transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block text-center py-2 text-xs font-semibold text-forest-800 hover:text-gold-700 transition-colors"
                >
                  View full cart details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
