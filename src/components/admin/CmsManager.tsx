'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Save,
  Check,
  AlertCircle,
  FileText,
  Upload,
  Eye,
  Sparkles,
  HelpCircle,
  Star,
  Clock,
  ShieldCheck,
  Calendar,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  ThermometerSnowflake,
  MessageSquare,
} from 'lucide-react';
import { CustomerReview } from '@/data/reviews';

interface FaqItem {
  q: string;
  a: string;
}

export default function CmsManager() {
  const [activeTab, setActiveTab] = useState<
    'hero' | 'ticker' | 'reviews' | 'faqs' | 'subscription' | 'trust'
  >('hero');

  // Hero Section
  const [hero, setHero] = useState({
    title: 'Fresh milk. Straight from the farm.',
    subtitle: 'FRESH MILK, BUTTER & CLARIFIED BUTTER · PAKISTAN & OMAN',
    content:
      'Collected each morning at dawn, chilled below 4°C, and delivered directly to your doorstep across Dera Ismail Khan, nationwide Pakistan, and Oman. Pure unadulterated goodness.',
    imageUrl: '/products/hero-farm.jpg',
    buttonText: 'Shop Now',
    buttonLink: '#shop-catalog',
    isEnabled: true,
  });

  // About Section
  const [about, setAbout] = useState({
    title: 'Pure milk is non-negotiable. No chemicals, no powders, no shortcuts.',
    content:
      'Unlike commercial industrial brands that reconstitute powdered milk or add synthetic thickeners, SUNNY Dairy comes straight from healthy, grass-fed cattle.',
    imageUrl: '/products/hero-farm.jpg',
    buttonText: 'Read Our Full Quality Standard',
    buttonLink: '/our-promise',
    isEnabled: true,
  });

  // Batch Status Ticker
  const [ticker, setTicker] = useState({
    isEnabled: true,
    title: 'Live Farm Update',
    subtitle: 'Next Morning Batch: Milking at 4:30 AM · Insulated Cold-Chain Chilled',
    temp: 'Chilled below 4°C',
    purity: 'Lactometer Verified: 0% Water',
    hours: 'Doorstep: 7:00 AM – 11:30 AM',
  });

  // Customer Reviews
  const [reviewsSection, setReviewsSection] = useState({
    isEnabled: true,
    title: 'Trusted by Families Across Pakistan & Oman',
    subtitle: 'Verified Customer Experiences',
    content:
      'Authentic reviews from households in Dera Ismail Khan, Islamabad, Lahore, Karachi, and Muscat who rely on SUNNY Dairy for unadulterated farm purity.',
    reviews: [
      {
        id: 'rev-01',
        authorName: 'Tariq Mehmood',
        city: 'Dera Ismail Khan (Cantt)',
        country: 'Pakistan' as const,
        rating: 5,
        date: '2026-11-04',
        verifiedPurchase: true,
        productName: 'Fresh Cow Milk',
        comment:
          'We have subscribed to 3 Litres of fresh cow milk every morning. The delivery arrives right before 7:30 AM without fail. When my wife boils the milk, a thick, rich layer of clotted cream forms at the top. True zero water dilution. Outstanding quality!',
        avatarText: 'TM',
      },
      {
        id: 'rev-02',
        authorName: 'Fatima Al-Harthy',
        city: 'Muscat (Al Qurum)',
        country: 'Oman' as const,
        rating: 5,
        date: '2026-10-28',
        verifiedPurchase: true,
        productName: 'Pure Clarified Butter (Artisanal Ghee)',
        comment:
          'I ordered the 1kg jar of pure clarified butter delivered to Muscat. The aroma is heavenly and nutty with a true golden granular texture. We use it for our daily cooking and rice dishes. It arrived perfectly packed in sealed glass with no leaks.',
        avatarText: 'FA',
      },
      {
        id: 'rev-03',
        authorName: 'Dr. Shahzad Qureshi',
        city: 'Islamabad (Sector F-7)',
        country: 'Pakistan' as const,
        rating: 5,
        date: '2026-11-01',
        verifiedPurchase: true,
        productName: 'Pure Clarified Butter (Artisanal Ghee)',
        comment:
          'Being a medical practitioner, I am extremely particular about dietary fats. SUNNY Dairy clarified butter is 100% natural without any hydrogenated vegetable oils or trans fats. Excellent digestibility and superior smoke point for high-heat cooking.',
        avatarText: 'SQ',
      },
    ] as CustomerReview[],
  });

  // FAQs Section
  const [faqsSection, setFaqsSection] = useState({
    isEnabled: true,
    title: 'Frequently Asked Questions & Purity Standards',
    subtitle: 'Your Questions',
    content:
      'Transparent facts about our daily morning milking cycle, cold-chain temperature preservation, and doorstep delivery across Pakistan and Oman.',
    faqs: [
      {
        q: 'Is there any water dilution or chemicals added to the milk?',
        a: 'Absolutely not. SUNNY Dairy strictly adheres to a Zero Water Dilution policy. Every morning after milking, fat content and purity are verified using lactometers and testing kits. We never add water, preservatives, chemicals, or milk powder.',
      },
      {
        q: 'Is the milk raw or boiled?',
        a: 'Our milk is 100% natural, fresh raw whole milk chilled immediately after milking to below 4°C in food-grade stainless steel chillers. Once delivered to your home, simply boil it following normal kitchen practice.',
      },
      {
        q: 'How do I place an order and what are the delivery hours?',
        a: 'You can easily place an order through our website by adding products to your cart, or message us directly via WhatsApp. Morning deliveries take place between 7:00 AM and 11:30 AM across all major areas of Dera Ismail Khan.',
      },
      {
        q: 'Where can I buy 100% pure clarified butter (desi ghee) online in Pakistan?',
        a: 'You can order 100% pure artisanal clarified butter directly from SUNNY Dairy online. Our ghee is slow-simmered over low heat from pure cultured farm butter, sealed in airtight glass jars, and delivered to your doorstep nationwide.',
      },
    ] as FaqItem[],
  });

  // Daily Subscription Section
  const [subscriptionSection, setSubscriptionSection] = useState({
    isEnabled: true,
    title: 'Never run out of pure milk. Daily Morning Farm Delivery at your doorstep.',
    subtitle: 'Daily Morning Delivery',
    content:
      'Set up a hassle-free daily morning routine. Freshly collected from our farm at dawn, cold-chain chilled, and brought straight to your home across Dera Ismail Khan before you wake up.',
    plan1Title: '1 Litre Daily',
    plan1Subtitle: 'Singles & Morning Tea Lovers',
    plan1Desc: 'Pure morning cow milk in sealed sterilized packaging delivered daily before 8:30 AM.',
    plan2Title: '3 Litres Daily',
    plan2Subtitle: 'Most Popular for Families',
    plan2Desc: 'Ideal for breakfast, fresh homemade yogurt, children nutrition, and evening tea.',
  });

  // Trust Badges Section
  const [trustBadges, setTrustBadges] = useState({
    isEnabled: true,
    badges: [
      {
        title: 'Collected fresh',
        description: 'Milk collected daily at morning, zero preservatives or additives.',
      },
      {
        title: 'Kept cool',
        description: 'Chilled in food-grade stainless tanks immediately after milking.',
      },
      {
        title: 'Pay on delivery',
        description: 'Pay in cash or easy digital transfer only when your fresh order arrives.',
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/cms?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.sections) {
          const s = data.sections;
          if (s.hero) setHero((prev) => ({ ...prev, ...s.hero }));
          if (s.about) setAbout((prev) => ({ ...prev, ...s.about }));

          if (s.batch_ticker) {
            let meta: any = {};
            try {
              meta = typeof s.batch_ticker.metadata === 'string' ? JSON.parse(s.batch_ticker.metadata) : s.batch_ticker.metadata;
            } catch {}
            setTicker((prev) => ({
              ...prev,
              isEnabled: s.batch_ticker.isEnabled !== undefined ? s.batch_ticker.isEnabled : true,
              title: s.batch_ticker.title || prev.title,
              subtitle: s.batch_ticker.subtitle || prev.subtitle,
              temp: meta?.temp || prev.temp,
              purity: meta?.purity || prev.purity,
              hours: meta?.hours || prev.hours,
            }));
          }

          if (s.customer_reviews) {
            let list: any = [];
            try {
              list = typeof s.customer_reviews.metadata === 'string' ? JSON.parse(s.customer_reviews.metadata) : s.customer_reviews.metadata;
            } catch {}
            setReviewsSection((prev) => ({
              ...prev,
              isEnabled: s.customer_reviews.isEnabled !== undefined ? s.customer_reviews.isEnabled : true,
              title: s.customer_reviews.title || prev.title,
              subtitle: s.customer_reviews.subtitle || prev.subtitle,
              content: s.customer_reviews.content || prev.content,
              reviews: Array.isArray(list) && list.length > 0 ? list : prev.reviews,
            }));
          }

          if (s.faqs) {
            let list: any = [];
            try {
              list = typeof s.faqs.metadata === 'string' ? JSON.parse(s.faqs.metadata) : s.faqs.metadata;
            } catch {}
            setFaqsSection((prev) => ({
              ...prev,
              isEnabled: s.faqs.isEnabled !== undefined ? s.faqs.isEnabled : true,
              title: s.faqs.title || prev.title,
              subtitle: s.faqs.subtitle || prev.subtitle,
              content: s.faqs.content || prev.content,
              faqs: Array.isArray(list) && list.length > 0 ? list : prev.faqs,
            }));
          }

          if (s.subscription_banner) {
            let meta: any = {};
            try {
              meta = typeof s.subscription_banner.metadata === 'string' ? JSON.parse(s.subscription_banner.metadata) : s.subscription_banner.metadata;
            } catch {}
            setSubscriptionSection((prev) => ({
              ...prev,
              isEnabled: s.subscription_banner.isEnabled !== undefined ? s.subscription_banner.isEnabled : true,
              title: s.subscription_banner.title || prev.title,
              subtitle: s.subscription_banner.subtitle || prev.subtitle,
              content: s.subscription_banner.content || prev.content,
              plan1Title: meta?.plan1Title || prev.plan1Title,
              plan1Subtitle: meta?.plan1Subtitle || prev.plan1Subtitle,
              plan1Desc: meta?.plan1Desc || prev.plan1Desc,
              plan2Title: meta?.plan2Title || prev.plan2Title,
              plan2Subtitle: meta?.plan2Subtitle || prev.plan2Subtitle,
              plan2Desc: meta?.plan2Desc || prev.plan2Desc,
            }));
          }

          if (s.trust_badges) {
            let list: any = [];
            try {
              list = typeof s.trust_badges.metadata === 'string' ? JSON.parse(s.trust_badges.metadata) : s.trust_badges.metadata;
            } catch {}
            setTrustBadges((prev) => ({
              ...prev,
              isEnabled: s.trust_badges.isEnabled !== undefined ? s.trust_badges.isEnabled : true,
              badges: Array.isArray(list) && list.length > 0 ? list : prev.badges,
            }));
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (file: File, target: 'hero' | 'about') => {
    const isHero = target === 'hero';
    if (isHero) setUploadingHero(true);
    else setUploadingAbout(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (isHero) {
        setHero((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        setAbout((prev) => ({ ...prev, imageUrl: data.url }));
      }
      setMessage({ type: 'success', text: `${target === 'hero' ? 'Hero' : 'Promise'} image uploaded! Click Save to apply.` });
    } catch (e: any) {
      alert(e.message || 'Upload error');
    } finally {
      if (isHero) setUploadingHero(false);
      else setUploadingAbout(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        sections: {
          hero: { ...hero },
          about: { ...about },
          batch_ticker: {
            title: ticker.title,
            subtitle: ticker.subtitle,
            isEnabled: ticker.isEnabled,
            metadata: JSON.stringify({
              temp: ticker.temp,
              purity: ticker.purity,
              hours: ticker.hours,
            }),
          },
          customer_reviews: {
            title: reviewsSection.title,
            subtitle: reviewsSection.subtitle,
            content: reviewsSection.content,
            isEnabled: reviewsSection.isEnabled,
            metadata: JSON.stringify(reviewsSection.reviews),
          },
          faqs: {
            title: faqsSection.title,
            subtitle: faqsSection.subtitle,
            content: faqsSection.content,
            isEnabled: faqsSection.isEnabled,
            metadata: JSON.stringify(faqsSection.faqs),
          },
          subscription_banner: {
            title: subscriptionSection.title,
            subtitle: subscriptionSection.subtitle,
            content: subscriptionSection.content,
            isEnabled: subscriptionSection.isEnabled,
            metadata: JSON.stringify({
              plan1Title: subscriptionSection.plan1Title,
              plan1Subtitle: subscriptionSection.plan1Subtitle,
              plan1Desc: subscriptionSection.plan1Desc,
              plan2Title: subscriptionSection.plan2Title,
              plan2Subtitle: subscriptionSection.plan2Subtitle,
              plan2Desc: subscriptionSection.plan2Desc,
            }),
          },
          trust_badges: {
            isEnabled: trustBadges.isEnabled,
            metadata: JSON.stringify(trustBadges.badges),
          },
        },
      };

      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save website content');
      }

      setMessage({ type: 'success', text: '✓ All website content sections saved permanently! Live website is updated.' });
      setTimeout(() => setMessage(null), 5000);
    } catch (e: any) {
      setMessage({ type: 'error', text: 'Failed to save: ' + (e.message || 'Server error') });
    } finally {
      setSaving(false);
    }
  };

  // Review list helpers
  const addReviewItem = () => {
    setReviewsSection((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        {
          id: `rev-${Date.now()}`,
          authorName: 'New Customer',
          city: 'Dera Ismail Khan',
          country: 'Pakistan',
          rating: 5,
          date: new Date().toISOString().split('T')[0],
          verifiedPurchase: true,
          productName: 'Fresh Cow Milk',
          comment: 'Outstanding pure farm milk with natural rich cream layer!',
          avatarText: 'NC',
        },
      ],
    }));
  };

  const removeReviewItem = (idx: number) => {
    setReviewsSection((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== idx),
    }));
  };

  const updateReviewItem = (idx: number, field: string, val: any) => {
    setReviewsSection((prev) => {
      const copy = [...prev.reviews];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, reviews: copy };
    });
  };

  // FAQ list helpers
  const addFaqItem = () => {
    setFaqsSection((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { q: 'New Question?', a: 'Answer description here.' }],
    }));
  };

  const removeFaqItem = (idx: number) => {
    setFaqsSection((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx),
    }));
  };

  const updateFaqItem = (idx: number, field: 'q' | 'a', val: string) => {
    setFaqsSection((prev) => {
      const copy = [...prev.faqs];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, faqs: copy };
    });
  };

  if (loading) {
    return <div className="text-center py-16 text-muted text-sm">Loading CMS content suite...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-cream-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900 tracking-tight">
            Website Experience &amp; Content Suite
          </h1>
          <p className="text-xs sm:text-sm text-forest-600 mt-1">
            Complete editorial control over homepage headlines, live farm batch tickers, subscription plans, customer reviews, and FAQs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-forest-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center space-x-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Segment Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-cream-200 bg-white rounded-2xl p-1.5 shadow-xs gap-1.5 text-xs font-bold text-forest-700">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'hero'
              ? 'bg-forest-900 text-white shadow-xs'
              : 'text-forest-600 hover:bg-forest-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hero &amp; Promise</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ticker')}
          className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'ticker'
              ? 'bg-forest-900 text-white shadow-xs'
              : 'text-forest-600 hover:bg-forest-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Live Farm Ticker</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-forest-900 text-white shadow-xs'
              : 'text-forest-600 hover:bg-forest-50'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Customer Reviews ({reviewsSection.reviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'faqs'
              ? 'bg-forest-900 text-white shadow-xs'
              : 'text-forest-600 hover:bg-forest-50'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Homepage FAQs ({faqsSection.faqs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'subscription'
              ? 'bg-forest-900 text-white shadow-xs'
              : 'text-forest-600 hover:bg-forest-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Subscription Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trust')}
          className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'trust'
              ? 'bg-forest-900 text-white shadow-xs'
              : 'text-forest-600 hover:bg-forest-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trust Badges</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: HERO & PROMISE */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-cream-200">
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest-900">
                    1. Hero Top Section
                  </h3>
                  <p className="text-xs text-forest-500">Primary headline and top visual banner</p>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hero.isEnabled}
                    onChange={(e) => setHero({ ...hero, isEnabled: e.target.checked })}
                    className="rounded text-forest-800 focus:ring-forest-800"
                  />
                  <span className="font-bold text-forest-900 text-xs">Section Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-forest-800 uppercase tracking-wider text-xs mb-1">
                      Eyebrow Label / Badge
                    </label>
                    <input
                      type="text"
                      value={hero.subtitle}
                      onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200 text-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-800 uppercase tracking-wider text-xs mb-1">
                      Main Heading (H1)
                    </label>
                    <input
                      type="text"
                      value={hero.title}
                      onChange={(e) => setHero({ ...hero, title: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm font-serif font-bold rounded-xl border border-forest-200 text-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-800 uppercase tracking-wider text-xs mb-1">
                      Hero Paragraph Text
                    </label>
                    <textarea
                      rows={3}
                      value={hero.content}
                      onChange={(e) => setHero({ ...hero, content: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200 text-forest-900 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-forest-800 uppercase tracking-wider text-[11px] mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={hero.buttonText}
                        onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-forest-200"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-forest-800 uppercase tracking-wider text-[11px] mb-1">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={hero.buttonLink}
                        onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-forest-200 font-mono text-forest-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="space-y-3">
                  <label className="block font-bold text-forest-800 uppercase tracking-wider text-xs">
                    Hero Farm Image
                  </label>
                  <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-forest-900 border border-cream-200">
                    <img
                      src={hero.imageUrl || '/products/hero-farm.jpg'}
                      alt="Hero Farm"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={hero.imageUrl}
                      onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-forest-200 font-mono"
                    />
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-forest-900 bg-forest-100 hover:bg-forest-200 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingHero ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingHero}
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'hero')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Promise Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cream-200">
                <h3 className="font-serif text-lg font-bold text-forest-900">
                  2. Quality Promise Story
                </h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={about.isEnabled}
                    onChange={(e) => setAbout({ ...about, isEnabled: e.target.checked })}
                    className="rounded text-forest-800 focus:ring-forest-800"
                  />
                  <span className="font-bold text-forest-900 text-xs">Section Enabled</span>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider text-xs mb-1">
                    Promise Headline
                  </label>
                  <input
                    type="text"
                    value={about.title}
                    onChange={(e) => setAbout({ ...about, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-forest-200 text-forest-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-800 uppercase tracking-wider text-xs mb-1">
                    Promise Story Description
                  </label>
                  <textarea
                    rows={3}
                    value={about.content}
                    onChange={(e) => setAbout({ ...about, content: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200 text-forest-900 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE FARM BATCH TICKER */}
        {activeTab === 'ticker' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-900 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gold-600" />
                  <span>Live Farm Batch Ticker Controls</span>
                </h3>
                <p className="text-xs text-forest-500">
                  Dynamic banner displayed right below hero showing milking cycle and chilling status.
                </p>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ticker.isEnabled}
                  onChange={(e) => setTicker({ ...ticker, isEnabled: e.target.checked })}
                  className="rounded text-forest-800 focus:ring-forest-800"
                />
                <span className="font-bold text-forest-900 text-xs">Ticker Enabled</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                  Live Tag / Eyebrow
                </label>
                <input
                  type="text"
                  value={ticker.title}
                  onChange={(e) => setTicker({ ...ticker, title: e.target.value })}
                  placeholder="Live Farm Update"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                  Next Batch Milking Announcement
                </label>
                <input
                  type="text"
                  value={ticker.subtitle}
                  onChange={(e) => setTicker({ ...ticker, subtitle: e.target.value })}
                  placeholder="Next Morning Batch: Milking at 4:30 AM · Insulated Cold-Chain Chilled"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                  Chilling Temperature Stat
                </label>
                <input
                  type="text"
                  value={ticker.temp}
                  onChange={(e) => setTicker({ ...ticker, temp: e.target.value })}
                  placeholder="Chilled below 4°C"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                  Purity / Lactometer Stat
                </label>
                <input
                  type="text"
                  value={ticker.purity}
                  onChange={(e) => setTicker({ ...ticker, purity: e.target.value })}
                  placeholder="Lactometer Verified: 0% Water"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                  Doorstep Delivery Hours
                </label>
                <input
                  type="text"
                  value={ticker.hours}
                  onChange={(e) => setTicker({ ...ticker, hours: e.target.value })}
                  placeholder="Doorstep: 7:00 AM – 11:30 AM"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200 font-bold text-gold-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-900 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-gold-600 fill-gold-500/20" />
                  <span>Customer Reviews &amp; Testimonials Hub</span>
                </h3>
                <p className="text-xs text-forest-500">
                  Manage reviews displayed on homepage and their Schema.org review markup.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={addReviewItem}
                  className="px-4 py-2 text-xs font-bold text-white bg-forest-900 rounded-xl hover:bg-forest-800 inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewsSection.isEnabled}
                    onChange={(e) => setReviewsSection({ ...reviewsSection, isEnabled: e.target.checked })}
                    className="rounded text-forest-800 focus:ring-forest-800"
                  />
                  <span className="font-bold text-forest-900 text-xs">Section Enabled</span>
                </label>
              </div>
            </div>

            {/* Section Header Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-cream-100">
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest-800">Heading Title</label>
                <input
                  type="text"
                  value={reviewsSection.title}
                  onChange={(e) => setReviewsSection({ ...reviewsSection, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-forest-200 font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest-800">Eyebrow Badge</label>
                <input
                  type="text"
                  value={reviewsSection.subtitle}
                  onChange={(e) => setReviewsSection({ ...reviewsSection, subtitle: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-forest-200"
                />
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsSection.reviews.map((rev, idx) => (
                <div
                  key={rev.id || idx}
                  className="p-4 sm:p-5 rounded-2xl border border-cream-200 bg-cream-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-forest-900">Review #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeReviewItem(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold inline-flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-forest-700">Author Name</label>
                      <input
                        type="text"
                        value={rev.authorName}
                        onChange={(e) => updateReviewItem(idx, 'authorName', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-forest-700">City / Location</label>
                      <input
                        type="text"
                        value={rev.city}
                        onChange={(e) => updateReviewItem(idx, 'city', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-forest-700">Rating (1 to 5 Stars)</label>
                      <select
                        value={rev.rating}
                        onChange={(e) => updateReviewItem(idx, 'rating', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200 bg-white"
                      >
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★☆</option>
                        <option value={3}>3 Stars ★★★☆☆</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-forest-700">Date</label>
                      <input
                        type="text"
                        value={rev.date}
                        onChange={(e) => updateReviewItem(idx, 'date', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-forest-700">Review Feedback</label>
                    <textarea
                      rows={2}
                      value={rev.comment}
                      onChange={(e) => updateReviewItem(idx, 'comment', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HOMEPAGE FAQS */}
        {activeTab === 'faqs' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-900 flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-gold-600" />
                  <span>Homepage Frequently Asked Questions</span>
                </h3>
                <p className="text-xs text-forest-500">
                  Questions and answers shown on homepage accordion and FAQ Schema.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="px-4 py-2 text-xs font-bold text-white bg-forest-900 rounded-xl hover:bg-forest-800 inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faqsSection.isEnabled}
                    onChange={(e) => setFaqsSection({ ...faqsSection, isEnabled: e.target.checked })}
                    className="rounded text-forest-800 focus:ring-forest-800"
                  />
                  <span className="font-bold text-forest-900 text-xs">Section Enabled</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {faqsSection.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl border border-cream-200 bg-cream-50/50 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-forest-900">FAQ Item #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaqItem(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-forest-700">Question</label>
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => updateFaqItem(idx, 'q', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-forest-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-forest-700">Answer</label>
                    <textarea
                      rows={2}
                      value={faq.a}
                      onChange={(e) => updateFaqItem(idx, 'a', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SUBSCRIPTION BANNER */}
        {activeTab === 'subscription' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h3 className="font-serif text-lg font-bold text-forest-900">
                Daily Morning Milk Subscription Banner
              </h3>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subscriptionSection.isEnabled}
                  onChange={(e) =>
                    setSubscriptionSection({ ...subscriptionSection, isEnabled: e.target.checked })
                  }
                  className="rounded text-forest-800 focus:ring-forest-800"
                />
                <span className="font-bold text-forest-900 text-xs">Banner Enabled</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest-800 uppercase mb-1">
                  Headline Title
                </label>
                <input
                  type="text"
                  value={subscriptionSection.title}
                  onChange={(e) =>
                    setSubscriptionSection({ ...subscriptionSection, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-forest-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-800 uppercase mb-1">
                  Description Text
                </label>
                <textarea
                  rows={2}
                  value={subscriptionSection.content}
                  onChange={(e) =>
                    setSubscriptionSection({ ...subscriptionSection, content: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-cream-200 bg-cream-50/50 space-y-2">
                  <span className="font-bold text-xs text-forest-900">Plan 1 (1 Litre Daily)</span>
                  <input
                    type="text"
                    value={subscriptionSection.plan1Title}
                    onChange={(e) =>
                      setSubscriptionSection({ ...subscriptionSection, plan1Title: e.target.value })
                    }
                    placeholder="Plan 1 Title"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                  />
                  <input
                    type="text"
                    value={subscriptionSection.plan1Desc}
                    onChange={(e) =>
                      setSubscriptionSection({ ...subscriptionSection, plan1Desc: e.target.value })
                    }
                    placeholder="Plan 1 Description"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                  />
                </div>

                <div className="p-4 rounded-xl border border-cream-200 bg-cream-50/50 space-y-2">
                  <span className="font-bold text-xs text-forest-900">Plan 2 (3 Litres Daily)</span>
                  <input
                    type="text"
                    value={subscriptionSection.plan2Title}
                    onChange={(e) =>
                      setSubscriptionSection({ ...subscriptionSection, plan2Title: e.target.value })
                    }
                    placeholder="Plan 2 Title"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                  />
                  <input
                    type="text"
                    value={subscriptionSection.plan2Desc}
                    onChange={(e) =>
                      setSubscriptionSection({ ...subscriptionSection, plan2Desc: e.target.value })
                    }
                    placeholder="Plan 2 Description"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TRUST BADGES */}
        {activeTab === 'trust' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h3 className="font-serif text-lg font-bold text-forest-900">
                Trust Guarantee Badges
              </h3>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trustBadges.isEnabled}
                  onChange={(e) => setTrustBadges({ ...trustBadges, isEnabled: e.target.checked })}
                  className="rounded text-forest-800 focus:ring-forest-800"
                />
                <span className="font-bold text-forest-900 text-xs">Section Enabled</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trustBadges.badges.map((b, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-cream-200 bg-cream-50/50 space-y-2">
                  <span className="font-bold text-xs text-forest-900">Badge #{idx + 1}</span>
                  <input
                    type="text"
                    value={b.title}
                    onChange={(e) => {
                      const copy = [...trustBadges.badges];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setTrustBadges({ ...trustBadges, badges: copy });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-forest-200"
                  />
                  <textarea
                    rows={2}
                    value={b.description}
                    onChange={(e) => {
                      const copy = [...trustBadges.badges];
                      copy[idx] = { ...copy[idx], description: e.target.value };
                      setTrustBadges({ ...trustBadges, badges: copy });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl text-xs font-bold text-forest-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save All Website Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
