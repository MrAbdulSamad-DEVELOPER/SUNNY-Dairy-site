'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace('/admin');
        }
        if (data.needsInitialSetup) {
          setNeedsSetup(true);
        }
      })
      .catch(console.error);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#FFFDFA] rounded-3xl p-8 sm:p-10 border border-borderCream shadow-xl space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="relative w-28 h-20 mx-auto">
            <Image
              src="/logo.png"
              alt="SUNNY Dairy Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold-700">
              Operations Center
            </span>
            <h1 className="font-serif text-2xl font-bold text-forest-800">
              SUNNY Dairy Portal
            </h1>
            <p className="text-xs text-muted">
              Enter your authorized administrator credentials
            </p>
          </div>
        </div>

        {needsSetup && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
            <p className="font-bold">Initial Setup Required</p>
            <p>No administrator account detected in system. Run secure initial setup.</p>
            <Link
              href="/admin/setup"
              className="inline-block px-3 py-1.5 bg-amber-700 text-white rounded-lg font-bold text-xs hover:bg-amber-800"
            >
              Start First-Time Setup →
            </Link>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
              <User className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-borderCream/60 flex items-center justify-center space-x-1.5 text-[11px] text-muted">
          <ShieldCheck className="w-4 h-4 text-forest-600" />
          <span>Encrypted Session · Protected Endpoints</span>
        </div>
      </div>
    </div>
  );
}
