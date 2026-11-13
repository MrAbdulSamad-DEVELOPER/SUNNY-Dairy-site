'use client';

import React, { useState, useMemo } from 'react';
import { ProductDTO } from '@/types';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface ShopCatalogProps {
  initialProducts: ProductDTO[];
  showTitle?: boolean;
}

export default function ShopCatalog({
  initialProducts,
  showTitle = true,
}: ShopCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'milk-and-yogurt', label: 'Milk & Yogurt' },
    { id: 'dairy-products', label: 'Dairy Products' },
    { id: 'traditional-sweets', label: 'Traditional Sweets' },
    { id: 'drinks', label: 'Drinks' },
  ];

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.category?.slug === activeCategory;

      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [initialProducts, activeCategory, searchQuery]);

  return (
    <section id="shop-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {showTitle && (
        <div className="space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700 block">
            The Shop
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-800">
            Milk, makhan & ghee
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            Collected fresh daily from our farm. Guaranteed pure, unadulterated, and delivered chilled to your doorstep all over Pakistan.
          </p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-borderCream">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-[#FFFDFA] text-forest-800 border border-borderCream hover:border-forest-700/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milk, ghee, sweets..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-borderCream rounded-full text-sm text-forest-800 placeholder-muted/70 focus:outline-none focus:ring-2 focus:ring-forest-800"
          />
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFDFA] rounded-3xl border border-borderCream p-8">
          <Sparkles className="w-10 h-10 text-gold-500 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-forest-800">No products found</h3>
          <p className="text-sm text-muted mt-1">
            Try adjusting your search or category filter.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-5 py-2 bg-forest-800 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
