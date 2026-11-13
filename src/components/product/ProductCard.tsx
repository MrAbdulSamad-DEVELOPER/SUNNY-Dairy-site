'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductDTO, ProductVariantDTO } from '@/types';
import { useCart } from '@/lib/cart-context';
import { Check, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: ProductDTO;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  // Default to first variant, or 1kg/1L if available
  const initialVariant =
    product.variants.find((v) => v.size === '1kg' || v.size === '1L') ||
    product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDTO>(initialVariant);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isConfirmed =
    selectedVariant?.priceType === 'CONFIRMED' && selectedVariant?.price !== null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      selectedVariant: selectedVariant.size,
      price: isConfirmed ? selectedVariant.price : null,
      priceType: selectedVariant.priceType,
      quantity: 1,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isWeight = selectedVariant?.size.includes('g') || selectedVariant?.size.includes('kg');
  const selectorLabel = isWeight ? 'Weight' : 'Size';

  return (
    <div className="group bg-[#FFFDFA] rounded-2xl border border-borderCream/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Product Image: Clean 4:3 Aspect Ratio with Cover Fit */}
        <Link
          href={`/product/${product.slug}`}
          className="block relative aspect-[4/3] w-full overflow-hidden bg-cream-200"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {product.isFeatured && (
            <span className="absolute top-2.5 left-2.5 bg-forest-800/90 backdrop-blur-sm text-gold-300 text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Farm Fresh
            </span>
          )}
        </Link>

        {/* Product Information */}
        <div className="p-3.5 sm:p-4 space-y-2.5">
          <div>
            <Link href={`/product/${product.slug}`} className="block">
              <h3 className="font-serif text-[21px] sm:text-[22px] font-bold text-forest-800 leading-snug group-hover:text-forest-700 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 text-[14px] text-muted line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size / Weight Selector Pills */}
          {product.variants.length > 0 && (
            <div className="space-y-1 pt-0.5">
              <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                {selectorLabel}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-150 ${
                        isSelected
                          ? 'bg-forest-800 text-white shadow-sm ring-1 ring-forest-800'
                          : 'bg-cream-100/90 text-forest-800 border border-borderCream hover:border-forest-600/50'
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Compact Order Button */}
      <div className="p-3.5 sm:p-4 pt-3 border-t border-borderCream/60 mt-auto flex flex-col justify-between gap-2.5">
        <div className="flex items-center justify-between gap-2">
          {isConfirmed ? (
            <div>
              <div className="font-serif text-lg sm:text-xl font-bold text-forest-800 tracking-tight leading-tight">
                Rs {selectedVariant.price?.toLocaleString()}
              </div>
              <span className="text-[10px] sm:text-[11px] text-muted block mt-0.5">
                confirmed price · per unit
              </span>
            </div>
          ) : (
            <div>
              <div className="font-serif text-base sm:text-lg font-bold text-forest-800 leading-tight">
                Price on Request
              </div>
              <span className="text-[10px] sm:text-[11px] text-gold-700 font-medium block mt-0.5">
                Confirm price on WhatsApp
              </span>
            </div>
          )}
        </div>

        {/* Action Button - Full width so text and button NEVER overlap */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedVariant?.isAvailable}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-1.5 shadow-sm ${
            !selectedVariant?.isAvailable
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : addedAnimation
              ? 'bg-forest-800 text-white'
              : 'bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 text-gold-400 animate-bounce" />
              <span>Added to Basket!</span>
            </>
          ) : isConfirmed ? (
            <>
              <ShoppingBag className="w-4 h-4 opacity-80" />
              <span>Add to cart</span>
            </>
          ) : (
            <>
              <span>Request Order</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
