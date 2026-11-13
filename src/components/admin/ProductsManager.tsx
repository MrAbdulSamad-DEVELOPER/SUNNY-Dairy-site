'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductDTO, CategoryDTO } from '@/types';
import { Plus, Edit2, Trash2, Copy, Check, X, Sparkles, Upload, Search } from 'lucide-react';

interface VariantDraft {
  size: string;
  price: string;
  priceType: 'CONFIRMED' | 'ON_REQUEST';
  isAvailable: boolean;
  stock?: number;
}

export default function ProductsManager() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('/products/cow-milk.jpg');
  const [sku, setSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState(100);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [variants, setVariants] = useState<VariantDraft[]>([
    { size: '1kg', price: '', priceType: 'ON_REQUEST', isAvailable: true, stock: 50 },
  ]);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/products?includeInactive=true&_t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        }),
        fetch(`/api/categories?_t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        }),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
      }
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }
    } catch (e) {
      console.error('Failed to fetch catalog:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setDescription('');
    setShortDescription('');
    setCategoryId(categories[0]?.id || '');
    setImageUrl('/products/cow-milk.jpg');
    setSku('');
    setStockQuantity(100);
    setLowStockThreshold(10);
    setIsActive(true);
    setIsFeatured(false);
    setVariants([
      { size: '1L', price: '', priceType: 'ON_REQUEST', isAvailable: true, stock: 50 },
      { size: '2L', price: '', priceType: 'ON_REQUEST', isAvailable: true, stock: 30 },
    ]);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductDTO) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setDescription(p.description);
    setShortDescription(p.shortDescription || '');
    setCategoryId(p.categoryId);
    setImageUrl(p.imageUrl);
    setSku(p.sku || '');
    setStockQuantity(p.stockQuantity || 100);
    setLowStockThreshold(p.lowStockThreshold || 10);
    setIsActive(p.isActive);
    setIsFeatured(p.isFeatured);
    setVariants(
      p.variants.map((v) => ({
        size: v.size,
        price: v.price !== null ? v.price.toString() : '',
        priceType: v.priceType,
        isAvailable: v.isAvailable,
        stock: v.stock || 50,
      }))
    );
    setError(null);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (p: ProductDTO) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${p.name} (Copy)`,
          slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
          description: p.description,
          shortDescription: p.shortDescription,
          categoryId: p.categoryId,
          imageUrl: p.imageUrl,
          sku: `${p.sku || 'SNY'}-COPY`,
          stockQuantity: p.stockQuantity,
          lowStockThreshold: p.lowStockThreshold,
          isActive: false,
          isFeatured: false,
          variants: p.variants.map((v) => ({
            size: v.size,
            price: v.price,
            priceType: v.priceType,
            isAvailable: v.isAvailable,
            stock: v.stock,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProducts((prev) => [data.product, ...prev]);
        }
        setMessage(`Duplicated ${p.name}`);
        fetchCatalog();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setImageUrl(data.url);
      setMessage('Product image uploaded successfully!');
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: '500g', price: '', priceType: 'ON_REQUEST', isAvailable: true, stock: 30 }]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleVariantChange = (idx: number, field: keyof VariantDraft, val: any) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], [field]: val };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      shortDescription,
      categoryId,
      imageUrl,
      sku,
      stockQuantity,
      lowStockThreshold,
      isActive,
      isFeatured,
      variants,
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      // Instantly update UI on the very first save
      if (data.product) {
        setProducts((prev) =>
          editingProduct
            ? prev.map((p) => (p.id === data.product.id ? data.product : p))
            : [data.product, ...prev]
        );
      }

      setIsModalOpen(false);
      setMessage('Product saved successfully!');
      fetchCatalog();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      // Instantly remove from UI
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Product deleted');
        fetchCatalog();
      }
    } catch (e) {
      console.error(e);
      fetchCatalog();
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderCream">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            SUNNY Dairy Catalog
          </span>
          <h1 className="font-serif text-3xl font-bold text-forest-800">
            Products & Pricing Management
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Upload product photos, configure sizes, manage confirmed prices vs &ldquo;Price on Request&rdquo;, and update stock.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 text-xs font-medium flex items-center space-x-2">
          <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name, description, SKU..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-borderCream bg-[#FFFDFA] text-sm focus:outline-none focus:ring-1 focus:ring-forest-800"
        />
        <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 text-muted text-sm">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFDFA] rounded-3xl border border-borderCream p-8">
          <p className="font-bold text-forest-800">No products match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-[#FFFDFA] rounded-3xl p-5 border border-borderCream shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-cream-200 flex-shrink-0 border border-borderCream">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <h3 className="font-serif text-base font-bold text-forest-800 truncate">
                        {p.name}
                      </h3>
                      {p.isFeatured && (
                        <span className="text-[10px] bg-gold-100 text-gold-800 px-1.5 py-0.5 rounded font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted block">{p.category?.name || 'Dairy'}</span>
                    <span className="text-[11px] text-forest-700 font-semibold block">
                      Stock: {p.stockQuantity} units
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted line-clamp-2">{p.description}</p>

                {/* Variants pill list with prices */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">
                    Configured Sizes & Prices:
                  </span>
                  <div className="space-y-1">
                    {p.variants.map((v) => (
                      <div
                        key={v.id}
                        className="flex justify-between items-center text-xs bg-cream-100/60 px-2.5 py-1 rounded-lg"
                      >
                        <span className="font-semibold text-forest-900">{v.size}</span>
                        {v.priceType === 'CONFIRMED' && v.price !== null ? (
                          <span className="font-serif font-bold text-forest-800">
                            Rs {v.price.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gold-700 font-medium">
                            Price on Request
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-borderCream/60">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {p.isActive ? 'Active' : 'Disabled'}
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleDuplicate(p)}
                    className="p-1.5 rounded-lg border border-borderCream text-muted hover:text-forest-800 text-xs"
                    title="Duplicate product"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg border border-borderCream text-forest-800 hover:bg-cream-100 text-xs font-semibold flex items-center space-x-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-lg border border-borderCream text-red-600 hover:bg-red-50 text-xs"
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-borderCream shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-borderCream">
              <h3 className="font-serif text-xl font-bold text-forest-800">
                {editingProduct ? 'Edit Product & Rates' : 'Add New Dairy Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-muted hover:text-forest-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white font-medium focus:outline-none focus:ring-1 focus:ring-forest-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Preview & Upload Controls */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-borderCream space-y-3">
                <span className="block font-bold text-forest-800 uppercase tracking-wider">
                  Product Image
                </span>
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream-200 border border-borderCream flex-shrink-0">
                    <Image src={imageUrl} alt="Product Preview" fill className="object-cover" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="cursor-pointer px-3.5 py-1.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-2">
                      <Upload className="w-3.5 h-3.5 text-gold-400" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image from Device'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="/products/cow-milk.jpg"
                      className="w-full px-2.5 py-1 rounded-lg border border-borderCream bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. SNY-MILK-01"
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One sentence summary for product cards"
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Full Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div className="flex items-center space-x-6 py-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-forest-800 focus:ring-forest-800"
                  />
                  <span className="font-semibold text-forest-800">Active (Visible in shop)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-forest-800 focus:ring-forest-800"
                  />
                  <span className="font-semibold text-forest-800">Featured on Homepage</span>
                </label>
              </div>

              {/* Sizes and Pricing Rules */}
              <div className="pt-2 border-t border-borderCream space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-forest-800 uppercase tracking-wider block">
                    Product Sizes & Pricing Rules
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-gold-700 hover:text-gold-800 font-bold"
                  >
                    + Add Size / Variant
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-cream-50 border border-borderCream flex flex-wrap items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Size (e.g. 1L, 1kg)"
                        value={v.size}
                        onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                        className="w-24 px-2 py-1.5 rounded-lg border border-borderCream bg-white font-medium"
                      />

                      <select
                        value={v.priceType}
                        onChange={(e) => handleVariantChange(idx, 'priceType', e.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-borderCream bg-white font-semibold"
                      >
                        <option value="ON_REQUEST">Price on Request</option>
                        <option value="CONFIRMED">Confirmed Price</option>
                      </select>

                      {v.priceType === 'CONFIRMED' && (
                        <div className="flex items-center space-x-1">
                          <span className="text-muted">Rs</span>
                          <input
                            type="number"
                            placeholder="Amount"
                            value={v.price}
                            onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                            className="w-24 px-2 py-1.5 rounded-lg border border-borderCream bg-white font-bold"
                          />
                        </div>
                      )}

                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="text-red-500 hover:text-red-700 ml-auto p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-borderCream">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-borderCream text-muted font-semibold hover:text-forest-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
