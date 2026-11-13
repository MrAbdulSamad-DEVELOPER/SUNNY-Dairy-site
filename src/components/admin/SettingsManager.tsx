'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Building2, Phone, MapPin, Truck } from 'lucide-react';

export default function SettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({
    whatsapp_number: '96895234002',
    store_phone: '03449322930',
    store_address: 'SUNNY Dairy Farm, Near Chashma Road, Dera Ismail Khan, KP, Pakistan',
    delivery_areas: 'Cantt, Circular Road, University Road, Bannu Road, Multan Road, Qayyum Nagar, Tank Road, Commissionery Bazaar',
    ubl_bank_name: 'United Bank Limited (UBL)',
    ubl_account_number: '236525896',
    ubl_account_title: 'Sanaullah and islamuddin',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Store settings and UBL bank transfer configuration saved successfully!');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('store_settings_updated'));
        }
      } else {
        setMessage(data.error || 'Failed to save settings');
      }
    } catch (e: any) {
      setMessage(e.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-muted">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream shadow-sm space-y-8">
      <div className="space-y-1 pb-4 border-b border-borderCream">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          Store Configuration
        </span>
        <h2 className="font-serif text-2xl font-bold text-forest-800">
          General & Payment Settings
        </h2>
        <p className="text-xs text-muted">
          Manage your WhatsApp order channel, customer support details, and UBL bank transfer parameters.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-forest-100 text-forest-900 font-medium text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-forest-700" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SECTION 1: UBL Bank Transfer Settings */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-900" />
            <h3 className="font-serif text-base font-bold text-amber-950">
              Advance Payment (UBL Bank Transfer) Settings
            </h3>
          </div>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            These credentials are displayed on the customer checkout page when selecting Advance Bank Transfer.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-amber-950 uppercase tracking-wider mb-1.5">
                Bank Name *
              </label>
              <input
                type="text"
                required
                value={settings.ubl_bank_name || 'United Bank Limited (UBL)'}
                onChange={(e) => handleChange('ubl_bank_name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-amber-950 uppercase tracking-wider mb-1.5">
                  Account / Bank Number *
                </label>
                <input
                  type="text"
                  required
                  value={settings.ubl_account_number || '236525896'}
                  onChange={(e) => handleChange('ubl_account_number', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <span className="text-[11px] text-amber-800 block mt-1">
                  Official Account Number: <code>236525896</code>
                </span>
              </div>

              <div>
                <label className="block font-bold text-amber-950 uppercase tracking-wider mb-1.5">
                  Account Title *
                </label>
                <input
                  type="text"
                  required
                  value={settings.ubl_account_title || 'Sanaullah and islamuddin'}
                  onChange={(e) => handleChange('ubl_account_title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: WhatsApp & Support Contact Settings */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-forest-800" />
            <h3 className="font-serif text-base font-bold text-forest-800">
              Communication Channels
            </h3>
          </div>

          <div>
            <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              WhatsApp Business Number (Country code, digits only) *
            </label>
            <input
              type="text"
              required
              placeholder="96895234002"
              value={settings.whatsapp_number}
              onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
            <p className="text-[11px] text-muted mt-1">
              Official WhatsApp: <code>96895234002</code> (+96895234002).
            </p>
          </div>

          <div>
            <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              Customer Support Phone (Display format)
            </label>
            <input
              type="text"
              value={settings.store_phone}
              onChange={(e) => handleChange('store_phone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>

          <div>
            <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              Farm Physical Address (Dera Ismail Khan)
            </label>
            <input
              type="text"
              value={settings.store_address}
              onChange={(e) => handleChange('store_address', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>

          <div>
            <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              Active Delivery Areas (Dera Ismail Khan)
            </label>
            <textarea
              rows={2}
              value={settings.delivery_areas}
              onChange={(e) => handleChange('delivery_areas', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-borderCream flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all active:scale-[0.99] flex items-center space-x-2"
          >
            <Save className="w-4 h-4 text-gold-400" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
