'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductDTO } from '@/types';
import { Boxes, AlertTriangle, Check, RefreshCw, ArrowUpDown } from 'lucide-react';

export default function InventoryManager() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [reason, setReason] = useState('Morning Batch Fresh Restock');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setLowStockCount(data.lowStockCount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAdjust = (p: ProductDTO) => {
    setSelectedProduct(p);
    setNewStock(p.stockQuantity);
    setReason('Daily Morning Batch Milking');
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          newStock,
          reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`Stock updated for ${selectedProduct.name} to ${newStock} units`);
        setSelectedProduct(null);
        fetchInventory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-borderCream min-w-0 max-w-full">
        <div className="min-w-0 max-w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-forest-900 tracking-tight break-words">
            Stock &amp; Inventory
          </h1>
          <p className="text-xs text-muted mt-1 break-words leading-relaxed max-w-full">
            Monitor product stock levels, set low-stock limits, and record fresh batch yields.
          </p>
        </div>

        {lowStockCount > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold self-start sm:self-auto flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>{lowStockCount} item(s) running low!</span>
          </div>
        )}
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 text-xs font-medium flex items-center space-x-2">
          <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Inventory Container */}
      <div className="bg-[#FFFDFA] rounded-2xl sm:rounded-3xl border border-borderCream shadow-xs overflow-hidden w-full max-w-full min-w-0">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading inventory...</div>
        ) : (
          <>
            {/* Mobile Card List View (< 768px) - 100% Responsive, Zero Text Squeeze */}
            <div className="block md:hidden p-3 sm:p-4 space-y-3 w-full max-w-full min-w-0">
              {products.map((p) => {
                const isLow = p.stockQuantity <= p.lowStockThreshold;
                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-white border border-borderCream/80 shadow-xs space-y-3 w-full max-w-full min-w-0 box-border"
                  >
                    {/* Top: Product Image, Title & Low/In Stock Pill */}
                    <div className="flex items-start gap-3 w-full min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0 border border-borderCream shadow-xs">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-forest-900 text-sm leading-snug line-clamp-2">
                            {p.name}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                              isLow
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] text-muted font-mono">
                          <span>{p.sku || 'No SKU'}</span>
                          <span>·</span>
                          <span className="font-sans">Min alert: {p.lowStockThreshold}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: 2-Column Info Stats Box */}
                    <div className="grid grid-cols-2 gap-2 bg-[#FBF9F5] p-2.5 rounded-xl border border-borderCream/60 text-xs">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-muted tracking-wider">
                          Current Stock
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            isLow ? 'text-red-700' : 'text-forest-900'
                          }`}
                        >
                          {p.stockQuantity} units
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-muted tracking-wider">
                          Sizes
                        </span>
                        <span className="text-xs text-forest-800 font-medium truncate block">
                          {p.variants.map((v) => v.size).join(', ') || 'Standard pack'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Full-Width Touch-Friendly Update Stock Button */}
                    <button
                      type="button"
                      onClick={() => openAdjust(p)}
                      className="w-full py-2.5 px-4 rounded-xl bg-forest-800 text-white font-semibold text-xs hover:bg-forest-900 active:scale-[0.99] flex items-center justify-center space-x-2 transition-all shadow-xs"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5 text-gold-400" />
                      <span>Update &amp; Record Batch Stock</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-100/70 border-b border-borderCream text-forest-900 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Product</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">In Stock</th>
                    <th className="py-3.5 px-4">Low Stock Limit</th>
                    <th className="py-3.5 px-4">Available Variants</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderCream/60">
                  {products.map((p) => {
                    const isLow = p.stockQuantity <= p.lowStockThreshold;
                    return (
                      <tr key={p.id} className="hover:bg-cream-50/60 transition-colors">
                        <td className="py-4 px-5 font-bold text-forest-900">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                              <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                            </div>
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted font-mono">{p.sku || '—'}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`font-bold text-sm ${
                              isLow ? 'text-red-700' : 'text-forest-800'
                            }`}
                          >
                            {p.stockQuantity} units
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted">{p.lowStockThreshold} units</td>
                        <td className="py-4 px-4 text-muted">
                          {p.variants.map((v) => v.size).join(', ')}
                        </td>
                        <td className="py-4 px-4">
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => openAdjust(p)}
                            className="px-3 py-1.5 rounded-lg bg-forest-800 text-white font-semibold text-xs hover:bg-forest-900 inline-flex items-center space-x-1"
                          >
                            <ArrowUpDown className="w-3 h-3 text-gold-400" />
                            <span>Adjust</span>
                          </button>
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

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-forest-950/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#FFFDFA] rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-8 border border-borderCream shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-forest-800 pb-2 border-b border-borderCream break-words">
              Adjust Stock: {selectedProduct.name}
            </h3>

            <form onSubmit={handleSaveStock} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-cream-100 text-muted">
                <span>Current Recorded Stock: </span>
                <strong className="text-forest-800">{selectedProduct.stockQuantity} units</strong>
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  New Stock Count *
                </label>
                <input
                  type="number"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white font-serif font-bold text-base text-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Reason for Adjustment *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white font-medium"
                >
                  <option value="Daily Morning Batch Milking">Daily Morning Batch Milking</option>
                  <option value="New Mithai Production Batch">New Mithai Production Batch</option>
                  <option value="Physical Count Audit">Physical Count Audit</option>
                  <option value="Perishable Spoiled / Discarded">Perishable Spoiled / Discarded</option>
                  <option value="Special Order Allocation">Special Order Allocation</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-borderCream">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl border border-borderCream text-muted font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-forest-800 text-white font-bold"
                >
                  {saving ? 'Updating...' : 'Save Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
