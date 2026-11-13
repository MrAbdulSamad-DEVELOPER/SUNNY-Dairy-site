'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, User, Mail, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminSetupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/setup')
      .then((res) => res.json())
      .then((data) => {
        setAllowed(data.setupAllowed);
      })
      .catch(() => setAllowed(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Setup failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Setup error');
    } finally {
      setLoading(false);
    }
  };

  if (allowed === false) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#FFFDFA] rounded-3xl p-8 border border-borderCream text-center space-y-4 shadow-lg">
          <ShieldCheck className="w-12 h-12 text-forest-700 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-forest-800">Setup Disabled</h2>
          <p className="text-xs text-muted leading-relaxed">
            An administrator account already exists. For security reasons, the initial setup wizard has been locked.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-block px-6 py-2.5 bg-forest-800 text-white rounded-xl text-xs font-bold hover:bg-forest-900"
            >
              Go to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#FFFDFA] rounded-3xl p-8 sm:p-10 border border-borderCream shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="relative w-28 h-20 mx-auto">
            <Image src="/logo.png" alt="SUNNY Dairy Logo" fill className="object-contain" priority />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold-700">
              First-Time Deployment
            </span>
            <h1 className="font-serif text-2xl font-bold text-forest-800">
              Create Primary Administrator
            </h1>
            <p className="text-xs text-muted">
              Configure your permanent master administrator account
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
              Admin Username *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. sanaullah or admin"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-white text-xs text-forest-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
              />
              <User className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
              Admin Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sunnydairy.pk"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-white text-xs text-forest-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
              />
              <Mail className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
              Secure Password (min 8 chars) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create strong password"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-white text-xs text-forest-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
              />
              <Lock className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-white text-xs text-forest-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
              />
              <Lock className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-2"
          >
            {loading ? <span>Configuring...</span> : <span>Create Master Account & Login</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
