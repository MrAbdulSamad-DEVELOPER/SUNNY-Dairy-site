'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Check, AlertCircle, Save, Phone, MessageSquare, Globe, Sparkles } from 'lucide-react';

export default function BrandingManager() {
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: 'SUNNY Dairy',
    store_owner: 'Sanaullah',
    store_logo: '/logo.png',
    store_favicon: '/logo.png',
    tagline: 'Fresh milk. Straight from the farm.',
    brand_description: 'Collected each morning, chilled and brought to your door. Order in a minute, pay in cash when it arrives.',
    store_phone: '03449322930',
    whatsapp_number: '96895234002',
    store_email: 'info@sunnydairy.pk',
    store_address: 'SUNNY Dairy Farm, Dera Ismail Khan, Pakistan',
    social_instagram: '',
    social_facebook: '',
  });

  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
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

      setSettings((prev) => ({ ...prev, store_logo: data.url }));
      setMessage('New logo uploaded! Remember to click Save Changes to persist.');
    } catch (err: any) {
      setError(err.message || 'Error uploading logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Branding & Store configuration saved successfully! Public storefront is updated.');
      } else {
        setError(data.error || 'Failed to save branding');
      }
    } catch (err: any) {
      setError(err.message || 'Server error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-muted text-sm">Loading branding controls...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-borderCream">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          Visual Identity & Contact
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest-800">
          Branding, Logo & Official Business Info
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Customize your store name, official logo, verified store owner details, and contact numbers.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 text-xs font-medium flex items-center space-x-2">
          <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 text-red-800 text-xs font-medium flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Logo & Visual Assets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFDFA] rounded-3xl p-6 border border-borderCream shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-forest-800 pb-2 border-b border-borderCream">
              Website Logo & Favicon
            </h3>

            {/* Current Logo Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">
                Active Website Logo
              </span>
              <div className="relative h-32 w-full rounded-2xl border-2 border-dashed border-borderCream bg-cream-50 flex items-center justify-center p-4">
                <Image
                  src={settings.store_logo || '/logo.png'}
                  alt="Store Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <p className="text-[11px] text-muted">
                Current source: <code>{settings.store_logo || '/logo.png'}</code>
              </p>
            </div>

            {/* Upload New Logo */}
            <div className="space-y-2 pt-2 border-t border-borderCream">
              <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider">
                Upload Replacement Logo
              </label>
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-2">
                  <Upload className="w-3.5 h-3.5 text-gold-400" />
                  <span>{uploadingLogo ? 'Uploading...' : 'Choose Image'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-muted">PNG, JPG, or WebP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Store Name, Tagline & Verified Business Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-forest-800 pb-2 border-b border-borderCream">
              Store Details & Verified Contacts
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Store Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.store_name}
                    onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-borderCream bg-white text-sm font-serif font-bold text-forest-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Store Owner / Business Contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.store_owner}
                    onChange={(e) => setSettings({ ...settings, store_owner: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-borderCream bg-white text-sm font-bold text-forest-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                  <span className="text-[10px] text-muted mt-0.5 block">Official: Sanaullah</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Business Calling Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={settings.store_phone}
                      onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-forest-800"
                    />
                    <Phone className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
                  </div>
                  <span className="text-[10px] text-muted mt-0.5 block">Official: 03449322930</span>
                </div>

                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    WhatsApp International Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={settings.whatsapp_number}
                      onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-forest-800"
                    />
                    <MessageSquare className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
                  </div>
                  <span className="text-[10px] text-muted mt-0.5 block">Format: 96895234002</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Tagline / Hero Eyebrow
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-borderCream bg-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Brand Description / Subtext
                </label>
                <textarea
                  rows={2}
                  value={settings.brand_description}
                  onChange={(e) => setSettings({ ...settings, brand_description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-borderCream bg-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Farm Address
                </label>
                <input
                  type="text"
                  value={settings.store_address}
                  onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-borderCream bg-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4 text-gold-400" />
                  <span>{saving ? 'Saving...' : 'Save Branding & Business Info'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
