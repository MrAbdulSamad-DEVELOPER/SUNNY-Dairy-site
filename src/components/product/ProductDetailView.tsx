'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductDTO, ProductVariantDTO } from '@/types';
import { useCart } from '@/lib/cart-context';
import { Check, ShoppingBag, Truck, ShieldCheck, Heart, ArrowLeft, MessageSquare } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface ProductDetailViewProps {
  product: ProductDTO;
  relatedProducts: ProductDTO[];
}

export default function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const { addItem } = useCart();

  const initialVariant =
    product.variants.find((v) => v.size === '1kg' || v.size === '1L') ||
    product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDTO>(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isConfirmed =
    selectedVariant.priceType === 'CONFIRMED' && selectedVariant.price !== null;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      selectedVariant: selectedVariant.size,
      price: isConfirmed ? selectedVariant.price : null,
      priceType: selectedVariant.priceType,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWhatsAppQuickInquiry = () => {
    const text = `Hello SUNNY Dairy! I am inquiring about *${product.name}* (${selectedVariant.size}). Please confirm current price and morning delivery availability in Dera Ismail Khan.`;
    window.open(getWhatsAppUrl(text), '_blank');
  };

  const isWeight = selectedVariant.size.includes('g') || selectedVariant.size.includes('kg');
  const selectorLabel = isWeight ? 'Select Weight' : 'Select Volume / Size';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-muted mb-8">
        <Link href="/" className="hover:text-forest-800 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-forest-800 transition-colors">
          Shop
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <span className="hover:text-forest-800 transition-colors">
              {product.category.name}
            </span>
            <span>/</span>
          </>
        )}
        <span className="text-forest-800 font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-[#FFFDFA] rounded-3xl p-6 sm:p-10 border border-borderCream shadow-card">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 border border-borderCream">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-forest-800 text-gold-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Farm Daily Special
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {product.category && (
              <span className="text-xs font-bold tracking-widest text-gold-700 uppercase">
                {product.category.name}
              </span>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-cream-100/70 border border-borderCream flex items-center justify-between">
              <div>
                {isConfirmed ? (
                  <div>
                    <div className="font-serif text-3xl font-bold text-forest-800">
                      Rs {selectedVariant.price?.toLocaleString()}
                    </div>
                    <span className="text-xs text-muted">
                      Confirmed price · {selectedVariant.size}
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="font-serif text-2xl font-bold text-forest-800">
                      Price on Request
                    </div>
                    <span className="text-xs text-gold-700 font-semibold">
                      Confirmed with customer via WhatsApp
                    </span>
                  </div>
                )}
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-100 text-forest-800">
                {selectedVariant.isAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-forest-800 block">
                  {selectorLabel}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-forest-800 text-white shadow-sm ring-2 ring-forest-800 ring-offset-1'
                            : 'bg-cream-100 text-forest-800 border border-borderCream hover:border-forest-600'
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-forest-800 block">
                Quantity
              </label>
              <div className="inline-flex items-center border border-borderCream rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-forest-800 hover:bg-cream-100 transition-colors text-base font-bold"
                >
                  -
                </button>
                <span className="px-5 py-2 text-sm font-bold text-forest-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-2 text-forest-800 hover:bg-cream-100 transition-colors text-base font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-borderCream">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedVariant.isAvailable}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-md ${
                  !selectedVariant.isAvailable
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-forest-800 text-white'
                    : 'btn-gold-shimmer'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-gold-400" />
                    <span>Added to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 opacity-90" />
                    <span>{isConfirmed ? 'Add to Basket' : 'Add to Order Request'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppQuickInquiry}
                className="py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 border border-forest-800/30 text-forest-800 hover:bg-cream-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-forest-700" />
                <span>Ask on WhatsApp</span>
              </button>
            </div>

            {/* Trust badges below CTA */}
            <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-muted">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>Morning cold-chain delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>Cash on delivery available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 space-y-6">
          <div className="border-b border-borderCream pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              Also from our dairy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-800">
              Related Farm Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group bg-[#FFFDFA] p-4 rounded-2xl border border-borderCream hover:shadow-card transition-all flex space-x-4 items-center"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-forest-800 group-hover:text-forest-600 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-muted line-clamp-1 mt-0.5">{p.description}</p>
                  <span className="text-xs font-semibold text-gold-700 mt-1 block">
                    View details & sizes →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
