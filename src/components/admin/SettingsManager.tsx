'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Save,
  Check,
  Building2,
  Phone,
  User,
  Mail,
  Lock,
  Camera,
  Upload,
  AlertCircle,
  Shield,
  FileText,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

function SettingsManagerContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'store' ? 'store' : 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'store'>(initialTab);

  // Profile state
  const [profile, setProfile] = useState<{
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    bio: string;
    role: string;
  }>({
    id: '',
    username: 'admin',
    email: 'sanaullah.ccs@gmail.com',
    fullName: 'Sanaullah',
    avatarUrl: '/profile.jpg',
    bio: 'Executive Farm Administrator & Founder of SUNNY Dairy Operations',
    role: 'SUPER_ADMIN',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Store settings state
  const [settings, setSettings] = useState<Record<string, string>>({
    whatsapp_number: '96895234002',
    store_phone: '03449322930',
    store_address: 'SUNNY Dairy Farm, Near Chashma Road, Dera Ismail Khan, KP, Pakistan',
    delivery_areas: 'Cantt, Circular Road, University Road, Bannu Road, Multan Road, Qayyum Nagar, Tank Road, Commissionery Bazaar',
    ubl_bank_name: 'United Bank Limited (UBL)',
    ubl_account_number: '236525896',
    ubl_account_title: 'Sanaullah and islamuddin',
  });
  const [savingStore, setSavingStore] = useState(false);
  const [storeMessage, setStoreMessage] = useState<string | null>(null);
  const [storeError, setStoreError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Fetch both profile & store settings on mount
  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/profile?_t=${Date.now()}`, { cache: 'no-store' })
        .then((r) => r.json())
        .catch(() => null),
      fetch(`/api/admin/settings?_t=${Date.now()}`, { cache: 'no-store' })
        .then((r) => r.json())
        .catch(() => null),
    ])
      .then(([profData, storeData]) => {
        if (profData?.success && profData?.user) {
          setProfile({
            id: profData.user.id || '',
            username: profData.user.username || 'admin',
            email: profData.user.email || 'sanaullah.ccs@gmail.com',
            fullName: profData.user.fullName || 'Sanaullah',
            avatarUrl: profData.user.avatarUrl || '/profile.jpg',
            bio: profData.user.bio || 'Executive Farm Administrator & Founder of SUNNY Dairy Operations',
            role: profData.user.role || 'SUPER_ADMIN',
          });
        }
        if (storeData?.success && storeData?.settings) {
          setSettings((prev) => ({ ...prev, ...storeData.settings }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle avatar upload via file input
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setProfileError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      setProfile((prev) => ({ ...prev, avatarUrl: data.url }));
      setProfileMessage('Photo uploaded! Click "Save Profile Changes" to make it permanent.');
    } catch (err: any) {
      setProfileError(err.message || 'Error uploading avatar photo');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setProfileError('New passwords do not match.');
      setSavingProfile(false);
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setProfileError('New password must be at least 6 characters long.');
      setSavingProfile(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profile.fullName,
          email: profile.email,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfileMessage('✓ Profile information and credentials saved permanently on the first click!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Dispatch event to update sidebar
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('admin_profile_updated'));
      }
    } catch (err: any) {
      setProfileError(err.message || 'Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Store Settings Update
  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStore(true);
    setStoreMessage(null);
    setStoreError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save settings');
      }

      if (typeof window !== 'undefined') {
        try {
          const existing = JSON.parse(localStorage.getItem('sunny_store_settings') || '{}');
          localStorage.setItem('sunny_store_settings', JSON.stringify({ ...existing, ...settings }));
          window.dispatchEvent(new Event('store_settings_updated'));
        } catch (e) {}
      }
      setStoreMessage('✓ Store settings and UBL bank transfer configuration saved permanently!');
    } catch (e: any) {
      setStoreError(e.message || 'Error saving settings');
    } finally {
      setSavingStore(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-sm text-muted">Loading settings & profile...</div>;
  }

  return (
    <div className="w-full min-w-0 max-w-4xl bg-[#FFFDFA] rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-borderCream shadow-sm space-y-6 sm:space-y-8">
      {/* Header & Tabs */}
      <div className="border-b border-borderCream pb-4 space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-forest-900 tracking-tight">
            Settings & Administrator Profile
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Manage your personal profile picture, bio, email, password, and public store configurations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 border-b border-borderCream/60 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-forest-800 text-forest-900'
                : 'border-transparent text-muted hover:text-forest-800'
            }`}
          >
            <User className="w-4 h-4 text-gold-600" />
            <span>Admin Profile & Security</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'store'
                ? 'border-forest-800 text-forest-900'
                : 'border-transparent text-muted hover:text-forest-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-gold-600" />
            <span>Store & Bank Settings</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: ADMIN PROFILE & SECURITY                      */}
      {/* ==================================================== */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6 text-xs">
          {profileMessage && (
            <div className="p-3.5 rounded-xl bg-forest-100 border border-forest-200 text-forest-900 font-medium text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
              <span>{profileMessage}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 font-medium text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {/* Section: Profile Image */}
          <div className="p-5 rounded-2xl bg-[#FBF9F4] border border-borderCream space-y-4">
            <h3 className="font-serif text-sm sm:text-base font-bold text-forest-900 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-gold-600" />
              <span>Profile Image & Avatar</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gold-400 shadow-md bg-white flex-shrink-0">
                <Image
                  src={profile.avatarUrl || '/profile.jpg'}
                  alt={profile.fullName || profile.username}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="space-y-2.5 text-center sm:text-left flex-1">
                <div className="space-y-0.5">
                  <p className="font-bold text-forest-900 text-sm">
                    {profile.fullName || profile.username}
                  </p>
                  <p className="text-[11px] text-muted">
                    Username: <span className="font-mono text-forest-800 font-bold">@{profile.username}</span> &middot; Role: <span className="text-gold-700 font-bold uppercase">{profile.role}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-gold-400" />
                    <span>{uploadingAvatar ? 'Uploading...' : 'Upload New Photo'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarFileChange}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setProfile((prev) => ({ ...prev, avatarUrl: '/profile.jpg' }));
                      setProfileMessage('Reset avatar to official Super Admin photo. Click Save Profile to apply.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-cream-100 border border-borderCream text-forest-900 font-bold text-xs flex items-center space-x-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-forest-600" />
                    <span>Use Default Profile Photo</span>
                  </button>
                </div>

                <p className="text-[10px] text-muted leading-relaxed">
                  Square JPG or PNG photo (root image: <code>/profile.jpg</code>).
                </p>
              </div>
            </div>
          </div>

          {/* Section: Bio & Name & Email */}
          <div className="p-5 rounded-2xl bg-white border border-borderCream space-y-4">
            <h3 className="font-serif text-sm sm:text-base font-bold text-forest-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-forest-700" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={profile.fullName}
                    onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="e.g. Sanaullah"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                  <User className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                  Administrator Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. sanaullah.ccs@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                </div>
                <span className="text-[10px] text-muted mt-1 block">
                  Password reset links will be delivered to this email address.
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Administrator Bio / Professional Notes
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Write a brief professional note or bio..."
                className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          {/* Section: Change Password */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4">
            <div className="space-y-0.5">
              <h3 className="font-serif text-sm sm:text-base font-bold text-amber-950 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-amber-800" />
                <span>Change Password (Optional)</span>
              </h3>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Leave blank if you do not want to change your current password.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-amber-950 uppercase tracking-wider mb-1.5 text-[11px]">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-950 uppercase tracking-wider mb-1.5 text-[11px]">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-950 uppercase tracking-wider mb-1.5 text-[11px]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile || uploadingAvatar}
              className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all active:scale-[0.99] flex items-center space-x-2"
            >
              <Save className="w-4 h-4 text-gold-400" />
              <span>{savingProfile ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================================================== */}
      {/* TAB 2: STORE & BANK SETTINGS                         */}
      {/* ==================================================== */}
      {activeTab === 'store' && (
        <form onSubmit={handleStoreSubmit} className="space-y-6 text-xs">
          {storeMessage && (
            <div className="p-3.5 rounded-xl bg-forest-100 text-forest-900 font-medium text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
              <span>{storeMessage}</span>
            </div>
          )}

          {storeError && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-800 font-medium text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{storeError}</span>
            </div>
          )}

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
                  onChange={(e) => setSettings((prev) => ({ ...prev, ubl_bank_name: e.target.value }))}
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
                    onChange={(e) => setSettings((prev) => ({ ...prev, ubl_account_number: e.target.value }))}
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
                    onChange={(e) => setSettings((prev) => ({ ...prev, ubl_account_title: e.target.value }))}
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
                onChange={(e) => setSettings((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
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
                onChange={(e) => setSettings((prev) => ({ ...prev, store_phone: e.target.value }))}
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
                onChange={(e) => setSettings((prev) => ({ ...prev, store_address: e.target.value }))}
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
                onChange={(e) => setSettings((prev) => ({ ...prev, delivery_areas: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-borderCream flex justify-end">
            <button
              type="submit"
              disabled={savingStore}
              className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all active:scale-[0.99] flex items-center space-x-2"
            >
              <Save className="w-4 h-4 text-gold-400" />
              <span>{savingStore ? 'Saving Store Settings...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function SettingsManager() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-sm text-muted">Loading settings...</div>}>
      <SettingsManagerContent />
    </Suspense>
  );
}
