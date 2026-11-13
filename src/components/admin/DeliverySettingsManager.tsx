'use client';

import React, { useState, useEffect } from 'react';
import { DeliveryZoneDTO } from '@/types';
import { Truck, Plus, Trash2, Edit2, Check, AlertCircle, Save } from 'lucide-react';

export default function DeliverySettingsManager() {
  const [zones, setZones] = useState<DeliveryZoneDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingZone, setEditingZone] = useState<Partial<DeliveryZoneDTO> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/delivery-zones');
      const data = await res.json();
      if (data.success) setZones(data.zones);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const openNew = () => {
    setEditingZone({
      areaName: '',
      city: 'Dera Ismail Khan',
      deliveryFee: 100,
      minOrderAmount: 300,
      freeDeliveryThreshold: 2500,
      estimatedMinutes: 45,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (z: DeliveryZoneDTO) => {
    setEditingZone(z);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone?.areaName) return;
    setSaving(true);

    try {
      const method = editingZone.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/delivery-zones', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingZone),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setMessage('Delivery zone saved successfully!');
        fetchZones();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this delivery zone?')) return;
    try {
      await fetch(`/api/admin/delivery-zones?id=${id}`, { method: 'DELETE' });
      fetchZones();
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
            Delivery Zones & Charges
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Configure area-specific delivery fees, minimum orders, and free delivery thresholds across Pakistan.
          </p>
        </div>

        <button
          onClick={openNew}
          className="self-start sm:self-auto px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Delivery Zone</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 text-xs font-medium flex items-center space-x-2">
          <Check className="w-4 h-4 text-forest-700" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Zones Container */}
      <div className="bg-[#FFFDFA] rounded-2xl sm:rounded-3xl border border-borderCream shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading delivery zones...</div>
        ) : zones.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm space-y-2">
            <Truck className="w-10 h-10 text-muted/40 mx-auto" />
            <p className="font-bold text-forest-800">No delivery zones configured.</p>
            <p className="text-xs text-muted">Add delivery coverage areas to calculate accurate shipping fees.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card List View (< 768px) */}
            <div className="block md:hidden divide-y divide-borderCream/70">
              {zones.map((z) => (
                <div key={z.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-forest-900 text-sm">{z.areaName}</h4>
                      <span className="text-[11px] text-muted font-medium bg-cream-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {z.city}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-forest-900 bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200/60 flex-shrink-0">
                      Fee: Rs {z.deliveryFee}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-muted bg-cream-50/60 p-2.5 rounded-xl border border-borderCream/50">
                    <div>
                      <span>Min Order: </span>
                      <strong className="text-forest-800">Rs {z.minOrderAmount}</strong>
                    </div>
                    <div>
                      <span>Free Over: </span>
                      <strong className="text-forest-800">{z.freeDeliveryThreshold ? `Rs ${z.freeDeliveryThreshold}` : 'None'}</strong>
                    </div>
                    <div>
                      <span>Est. Time: </span>
                      <strong className="text-forest-800">{z.estimatedMinutes} mins</strong>
                    </div>
                    <div>
                      <span>Status: </span>
                      <strong className={z.isActive ? 'text-emerald-700' : 'text-red-600'}>
                        {z.isActive ? 'Active' : 'Disabled'}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1 border-t border-borderCream/50">
                    <button
                      onClick={() => openEdit(z)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-borderCream bg-cream-50 text-xs font-semibold text-forest-900 hover:bg-cream-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-forest-700" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(z.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-100/70 border-b border-borderCream text-forest-900 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Area / Zone</th>
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">Delivery Fee</th>
                    <th className="py-3.5 px-4">Min Order</th>
                    <th className="py-3.5 px-4">Free Delivery Over</th>
                    <th className="py-3.5 px-4">Est. Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderCream/60">
                  {zones.map((z) => (
                    <tr key={z.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-4 px-5 font-bold text-forest-900">{z.areaName}</td>
                      <td className="py-4 px-4 text-muted">{z.city}</td>
                      <td className="py-4 px-4 font-bold text-forest-800">
                        Rs {z.deliveryFee}
                      </td>
                      <td className="py-4 px-4 text-muted">Rs {z.minOrderAmount}</td>
                      <td className="py-4 px-4 text-gold-800 font-semibold">
                        {z.freeDeliveryThreshold ? `Rs ${z.freeDeliveryThreshold}` : '—'}
                      </td>
                      <td className="py-4 px-4 text-muted">{z.estimatedMinutes} mins</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            z.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {z.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => openEdit(z)}
                          className="p-1.5 text-forest-800 hover:text-gold-700 hover:bg-cream-100 rounded-md transition-colors"
                          title="Edit zone"
                        >
                          <Edit2 className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(z.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete zone"
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

      {/* Modal */}
      {isModalOpen && editingZone && (
        <div className="fixed inset-0 z-50 bg-forest-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-borderCream shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-forest-800 pb-2 border-b border-borderCream">
              {editingZone.id ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Area Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHA Phase 6"
                  value={editingZone.areaName || ''}
                  onChange={(e) => setEditingZone({ ...editingZone, areaName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editingZone.city || 'Dera Ismail Khan'}
                    onChange={(e) => setEditingZone({ ...editingZone, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Delivery Fee (Rs) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingZone.deliveryFee || 0}
                    onChange={(e) => setEditingZone({ ...editingZone, deliveryFee: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Min Order (Rs)
                  </label>
                  <input
                    type="number"
                    value={editingZone.minOrderAmount || 0}
                    onChange={(e) => setEditingZone({ ...editingZone, minOrderAmount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Free Delivery Over (Rs)
                  </label>
                  <input
                    type="number"
                    value={editingZone.freeDeliveryThreshold || ''}
                    onChange={(e) => setEditingZone({ ...editingZone, freeDeliveryThreshold: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="3000"
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Est. Delivery Time (Minutes)
                </label>
                <input
                  type="number"
                  value={editingZone.estimatedMinutes || 45}
                  onChange={(e) => setEditingZone({ ...editingZone, estimatedMinutes: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingZone.isActive}
                    onChange={(e) => setEditingZone({ ...editingZone, isActive: e.target.checked })}
                    className="rounded text-forest-800 focus:ring-forest-800"
                  />
                  <span className="font-semibold text-forest-800">Zone Active for Orders</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-borderCream">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-borderCream text-muted font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-forest-800 text-white font-bold"
                >
                  {saving ? 'Saving...' : 'Save Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
