'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck, Mail, KeyRound, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [forgotIdentity, setForgotIdentity] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [directResetUrl, setDirectResetUrl] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
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

      // Smooth direct navigation
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setForgotSuccess(null);
    setDirectResetUrl(null);
    setDevCode(null);

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: forgotIdentity }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset request failed');
      }

      setForgotSuccess(data.message || 'Password reset link aapke email par bhej diya gaya hai.');
      if (data.resetUrl) {
        setDirectResetUrl(data.resetUrl);
      }
      if (data.devCode) {
        setDevCode(data.devCode);
        setResetCode(data.devCode);
      }
    } catch (err: any) {
      setError(err.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: resetCode, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      setResetSuccess(data.message || 'Password updated successfully!');
      setTimeout(() => {
        setMode('login');
        setResetSuccess(null);
        setError(null);
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-[#FFFDFA] rounded-3xl p-7 sm:p-10 border border-borderCream shadow-xl space-y-6">
        {/* Brand Header */}
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
              Operations Center
            </span>
            <h1 className="font-serif text-2xl font-bold text-forest-800">
              {mode === 'login' && 'Admin Portal'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'reset' && 'Create New Password'}
            </h1>
            <p className="text-xs text-muted">
              {mode === 'login' && 'Enter your authorized administrator credentials'}
              {mode === 'forgot' && 'Enter your registered administrator email address'}
              {mode === 'reset' && 'Enter your verification code and set a new password'}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {forgotSuccess && mode === 'forgot' && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs space-y-2.5">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{forgotSuccess}</span>
            </div>
            {directResetUrl && (
              <a
                href={directResetUrl}
                className="w-full py-2.5 px-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <span>Click Here to Set Your New Password</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
              </a>
            )}
          </div>
        )}

        {resetSuccess && (
          <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {/* 1. Normal Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="admin or email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <User className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setForgotSuccess(null);
                    setDirectResetUrl(null);
                    setMode('forgot');
                  }}
                  className="text-[11px] font-semibold text-gold-700 hover:text-gold-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
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
              className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
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
        )}

        {/* 2. Forgot Password Request Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                Registered Admin Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={forgotIdentity}
                  onChange={(e) => setForgotIdentity(e.target.value)}
                  placeholder="Enter your registered admin email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Sending Reset Link...</span>
              ) : (
                <>
                  <span>Send Reset Link to Email</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setForgotSuccess(null);
                setDirectResetUrl(null);
                setMode('login');
              }}
              className="w-full py-2 text-xs font-semibold text-muted hover:text-forest-800 flex items-center justify-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}

        {/* 3. Enter Code & Set New Password */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {devCode && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <span className="font-bold block">Verification Code:</span>
                <span className="font-mono text-base font-bold tracking-widest text-forest-900 bg-white px-2 py-0.5 rounded border border-amber-300 inline-block">
                  {devCode}
                </span>
                <p className="text-[10px] text-amber-800 mt-1">
                  (Verification code auto-detected from password reset request).
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                6-Digit Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.trim())}
                  placeholder="e.g. 123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm font-mono tracking-widest text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              </div>
            </div>

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
              className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save New Password</span>
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('login');
              }}
              className="w-full py-2 text-xs font-semibold text-muted hover:text-forest-800 flex items-center justify-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-borderCream/60 flex items-center justify-center space-x-1.5 text-[11px] text-muted">
          <ShieldCheck className="w-4 h-4 text-forest-600" />
          <span>Encrypted Session · Protected Endpoints</span>
        </div>
      </div>
    </div>
  );
}
