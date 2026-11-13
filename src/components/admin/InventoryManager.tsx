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
      const res = await fetch('/api/admin/inventory');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderCream">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            Stock & Fresh Batches
          </span>
          <h1 className="font-serif text-3xl font-bold text-forest-800">
            Real-Time Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Track daily milk yields, sweet batch counts, and manage low-stock thresholds.
          </p>
        </div>

        {lowStockCount > 0 && (
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{lowStockCount} item(s) running low on stock!</span>
          </div>
        )}
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 text-xs font-medium flex items-center space-x-2">
          <Check className="w-4 h-4 text-forest-700" />
          <span>{message}</span>
        </div>
      )}

      {/* Products Inventory Table */}
      <div className="bg-[#FFFDFA] rounded-3xl border border-borderCream shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading inventory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/70 border-b border-borderCream text-forest-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Product</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">In Stock</th>
                  <th className="py-3.5 px-4">Low Stock Limit</th>
                  <th className="py-3.5 px-4">Available Variants</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderCream/60">
                {products.map((p) => {
                  const isLow = p.stockQuantity <= p.lowStockThreshold;
                  return (
                    <tr key={p.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-bold text-forest-900">
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
                          className={`font-serif font-bold text-sm ${
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
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => openAdjust(p)}
                          className="px-3 py-1.5 rounded-lg bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 inline-flex items-center space-x-1"
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
        )}
      </div>

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-forest-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-borderCream shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-forest-800 pb-2 border-b border-borderCream">
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
