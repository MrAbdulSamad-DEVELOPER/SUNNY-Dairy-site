'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, KeyRound, CheckCircle2, AlertCircle, ArrowRight, ChevronLeft } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const t = searchParams.get('token');
    const c = searchParams.get('code');
    if (t) setToken(t);
    if (c) setCode(c);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token || undefined,
          code: code || undefined,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      setSuccess('Your password has been updated! Redirecting to sign in...');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-[#FFFDFA] rounded-3xl p-7 sm:p-10 border border-borderCream shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="relative w-24 h-16 mx-auto">
            <Image
              src="/nev-logo.png"
              alt="SUNNY Dairy Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold-700">
              Security Portal
            </span>
            <h1 className="font-serif text-2xl font-bold text-forest-800">
              Set New Password
            </h1>
            <p className="text-xs text-muted">
              Enter your new password to update your administrator credentials.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {token ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Password reset link is verified. Please set your new password below.</span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                6-Digit Code or Reset Token
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={code || token}
                  onChange={(e) => {
                    setCode(e.target.value.trim());
                    setToken(e.target.value.trim());
                  }}
                  placeholder="Enter 6-digit code or token"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm font-mono text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              New Password (min 6 chars)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
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
              <span>Updating Password...</span>
            ) : (
              <>
                <span>Save New Password & Sign In</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/admin/login"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-muted hover:text-forest-800"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-muted text-sm">Loading security portal...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
