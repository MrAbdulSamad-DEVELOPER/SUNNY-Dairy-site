'use client';

import React, { useState, useEffect } from 'react';
import { CategoryDTO } from '@/types';
import { Layers, Plus, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';

export default function CategoriesManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openNew = () => {
    setEditingCat(null);
    setName('');
    setSlug('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEdit = (c: any) => {
    setEditingCat(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = '/api/admin/categories';
      const method = editingCat ? 'PUT' : 'POST';
      const body = editingCat ? { id: editingCat.id, name, slug, description } : { name, slug, description };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setMessage('Category saved successfully!');
        fetchCats();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete category? Products in this category will also be affected.')) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchCats();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-borderCream">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-forest-900 tracking-tight">
            Categories
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Organize products into customer catalog filters (Milk & Yogurt, Dairy, Sweets, Drinks).
          </p>
        </div>

        <button
          onClick={openNew}
          className="self-start sm:self-auto px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Category</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 text-xs font-medium flex items-center space-x-2">
          <Check className="w-4 h-4 text-forest-700" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Categories Container */}
      <div className="bg-[#FFFDFA] rounded-2xl sm:rounded-3xl border border-borderCream shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm space-y-2">
            <Layers className="w-10 h-10 text-muted/40 mx-auto" />
            <p className="font-bold text-forest-800">No categories found.</p>
            <p className="text-xs text-muted">Create a category to organize your products.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card List View (Visible on screens < 768px) */}
            <div className="block md:hidden divide-y divide-borderCream/70">
              {categories.map((c) => (
                <div key={c.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-forest-900 text-sm">{c.name}</h4>
                      <span className="text-[11px] text-muted font-mono bg-cream-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        /{c.slug}
                      </span>
                    </div>
                    <span className="text-xs bg-forest-50 text-forest-800 px-2.5 py-1 rounded-full font-semibold border border-forest-200/50 flex-shrink-0">
                      {c._count?.products || 0} products
                    </span>
                  </div>

                  {c.description && (
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {c.description}
                    </p>
                  )}

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-borderCream/50">
                    <button
                      onClick={() => openEdit(c)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-borderCream bg-cream-50 text-xs font-semibold text-forest-900 hover:bg-cream-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-forest-700" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Visible on screens >= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-100/70 border-b border-borderCream text-forest-900 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Name</th>
                    <th className="py-3.5 px-4">Slug</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Products</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderCream/60">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-4 px-5 font-bold text-forest-900">{c.name}</td>
                      <td className="py-4 px-4 font-mono text-muted">{c.slug}</td>
                      <td className="py-4 px-4 text-muted max-w-sm truncate">{c.description || '—'}</td>
                      <td className="py-4 px-4 font-bold text-forest-800">
                        {c._count?.products || 0} product(s)
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 text-forest-800 hover:text-gold-700 hover:bg-cream-100 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-borderCream shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-forest-800 pb-2 border-b border-borderCream">
              {editingCat ? 'Edit Category' : 'Add Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated from name"
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-borderCream">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-borderCream text-muted font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-forest-800 text-white font-bold">
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
