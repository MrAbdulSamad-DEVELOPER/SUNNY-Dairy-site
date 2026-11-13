'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, Check, AlertCircle, FileText, Upload, Eye } from 'lucide-react';

export default function CmsManager() {
  const [hero, setHero] = useState({
    title: 'Fresh milk. Straight from the farm.',
    subtitle: 'MILK, MAKHAN & GHEE · PAKISTAN',
    content: 'Collected each morning, chilled and brought to your door. Order in a minute, pay in cash when it arrives.',
    imageUrl: '/products/hero-farm.jpg',
    buttonText: 'Shop Now',
    buttonLink: '#shop-catalog',
    isEnabled: true,
  });

  const [about, setAbout] = useState({
    title: 'Pure milk is non-negotiable. No chemicals, no powders, no shortcuts.',
    content: 'Unlike commercial industrial brands that reconstitute powdered milk or add synthetic thickeners, SUNNY Dairy comes straight from healthy, grass-fed cattle.',
    imageUrl: '/products/hero-farm.jpg',
    buttonText: 'Read Our Full Quality Standard',
    buttonLink: '/our-promise',
    isEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.sections) {
          if (data.sections.hero) setHero((prev) => ({ ...prev, ...data.sections.hero }));
          if (data.sections.about) setAbout((prev) => ({ ...prev, ...data.sections.about }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHero((prev) => ({ ...prev, imageUrl: data.url }));
      setMessage('Hero image uploaded! Click Save to apply.');
    } catch (e: any) {
      alert(e.message || 'Upload error');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await Promise.all([
        fetch('/api/admin/cms', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey: 'hero', ...hero }),
        }),
        fetch('/api/admin/cms', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey: 'about', ...about }),
        }),
      ]);

      setMessage('Homepage CMS content saved successfully! Refresh the public website to view.');
    } catch (e: any) {
      setMessage('Failed to save CMS sections');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-muted text-sm">Loading CMS content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-borderCream">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          CMS & Page Content
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest-800">
          Homepage & Website Content Editor
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Manage hero headlines, supporting descriptions, promotional callouts, and farm promise text without touching code.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 text-xs font-medium flex items-center space-x-2">
          <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* Hero Section Card */}
        <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-borderCream">
            <div>
              <h3 className="font-serif text-xl font-bold text-forest-800">
                1. Hero Header Section
              </h3>
              <p className="text-[11px] text-muted">Primary top section of homepage</p>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hero.isEnabled}
                onChange={(e) => setHero({ ...hero, isEnabled: e.target.checked })}
                className="rounded text-forest-800 focus:ring-forest-800"
              />
              <span className="font-bold text-forest-800 text-xs">Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Eyebrow Label / Badge
                </label>
                <input
                  type="text"
                  value={hero.subtitle || ''}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Main Hero Headline *
                </label>
                <input
                  type="text"
                  required
                  value={hero.title || ''}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white font-serif font-bold text-sm text-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Hero Supporting Subtext *
                </label>
                <textarea
                  rows={3}
                  required
                  value={hero.content || ''}
                  onChange={(e) => setHero({ ...hero, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={hero.buttonText || ''}
                    onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                    Button Destination Link
                  </label>
                  <input
                    type="text"
                    value={hero.buttonLink || ''}
                    onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Right: Hero Image Preview & Upload */}
            <div className="space-y-3">
              <label className="block font-bold text-forest-800 uppercase tracking-wider">
                Hero Image
              </label>
              <div className="relative h-52 w-full rounded-2xl overflow-hidden border border-borderCream bg-cream-100">
                <Image
                  src={hero.imageUrl || '/products/hero-farm.jpg'}
                  alt="Hero Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-2">
                  <Upload className="w-3.5 h-3.5 text-gold-400" />
                  <span>{uploadingHero ? 'Uploading...' : 'Replace Hero Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    disabled={uploadingHero}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-muted">Upload high-res farm image</span>
              </div>
            </div>
          </div>
        </div>

        {/* About & Quality Promise Section Card */}
        <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-borderCream">
            <div>
              <h3 className="font-serif text-xl font-bold text-forest-800">
                2. Farm Quality Promise Banner
              </h3>
              <p className="text-[11px] text-muted">Callout highlighting unadulterated pure standards</p>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={about.isEnabled}
                onChange={(e) => setAbout({ ...about, isEnabled: e.target.checked })}
                className="rounded text-forest-800 focus:ring-forest-800"
              />
              <span className="font-bold text-forest-800 text-xs">Enabled</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                Promise Heading
              </label>
              <input
                type="text"
                value={about.title || ''}
                onChange={(e) => setAbout({ ...about, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white font-serif font-bold text-sm text-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                Description / Body
              </label>
              <textarea
                rows={3}
                value={about.content || ''}
                onChange={(e) => setAbout({ ...about, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4 text-gold-400" />
            <span>{saving ? 'Saving...' : 'Save All Website Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
