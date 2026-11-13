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
    selectedVariant.priceType === 'CONFIRMED' && selectedVariant.price !== null;

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

  const isWeight = selectedVariant.size.includes('g') || selectedVariant.size.includes('kg');
  const selectorLabel = isWeight ? 'Weight' : 'Size';

  return (
    <div className="group bg-[#FFFDFA] rounded-3xl border border-borderCream/80 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image */}
        <Link href={`/product/${product.slug}`} className="block relative h-64 sm:h-72 w-full overflow-hidden bg-cream-200">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {product.isFeatured && (
            <span className="absolute top-4 left-4 bg-forest-800/90 backdrop-blur-sm text-gold-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Farm Fresh
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-800 group-hover:text-forest-700 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-muted line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size / Weight Selector Pills */}
          {product.variants.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-medium text-muted uppercase tracking-wider block">
                {selectorLabel}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-150 ${
                        isSelected
                          ? 'bg-forest-800 text-white shadow-sm ring-1 ring-forest-800'
                          : 'bg-cream-100 text-forest-800 border border-borderCream hover:border-forest-600/50'
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

      {/* Card Footer: Price & Add To Cart Button */}
      <div className="p-5 sm:p-6 pt-0 flex items-end justify-between border-t border-borderCream/40 mt-2">
        <div>
          {isConfirmed ? (
            <div>
              <div className="font-serif text-2xl font-bold text-forest-800 tracking-tight">
                Rs {selectedVariant.price?.toLocaleString()}
              </div>
              <span className="text-[11px] text-muted block -mt-0.5">
                confirmed price · per unit
              </span>
            </div>
          ) : (
            <div>
              <div className="font-serif text-lg font-semibold text-forest-800">
                Price on Request
              </div>
              <span className="text-[11px] text-gold-700 font-medium block -mt-0.5">
                Confirm price on WhatsApp
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedVariant.isAvailable}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 flex items-center space-x-1.5 shadow-sm ${
            !selectedVariant.isAvailable
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : addedAnimation
              ? 'bg-forest-800 text-white'
              : 'bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 text-gold-400 animate-bounce" />
              <span>Added!</span>
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
