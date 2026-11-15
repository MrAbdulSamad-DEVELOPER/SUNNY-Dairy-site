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
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [forgotIdentity, setForgotIdentity] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Smooth direct navigation
      window.location.replace('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotSuccess(null);

    const emailTrimmed = forgotIdentity.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError('Please enter your registered administrator email address (e.g. sanaullah.ccs@gmail.com). Usernames like "admin" cannot be used for password resets.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: emailTrimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset request failed');
      }

      setForgotSuccess(data.message || 'Password reset link has been dispatched to your email address.');
    } catch (err: any) {
      setError(err.message || 'Error processing request');
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
            </h1>
            <p className="text-xs text-muted">
              {mode === 'login' && 'Enter your authorized administrator credentials'}
              {mode === 'forgot' && 'Enter your registered administrator email to receive a secure link'}
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
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-3">
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-forest-900">Reset Email Dispatched</p>
                <p className="text-muted leading-relaxed">{forgotSuccess}</p>
              </div>
            </div>
            <div className="p-3 bg-white/90 rounded-xl border border-emerald-100 text-[11px] text-forest-800 space-y-1">
              <p className="font-semibold text-emerald-900">Security Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted">
                <li>Open your email inbox (<span className="font-medium text-forest-900">{forgotIdentity}</span>).</li>
                <li>Look for the email sent from <strong className="text-forest-900">mr.abdulsamadabdullah@gmail.com</strong>.</li>
                <li>Click the secure link inside the email to choose your new password.</li>
              </ol>
            </div>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setForgotSuccess(null);
                setMode('login');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Admin Sign In</span>
            </button>
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
                  placeholder="admin or sanaullah.ccs@gmail.com"
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
        {mode === 'forgot' && !forgotSuccess && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                Registered Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={forgotIdentity}
                  onChange={(e) => setForgotIdentity(e.target.value)}
                  placeholder="e.g. sanaullah.ccs@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderCream bg-white text-sm text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-muted mt-1.5 leading-relaxed">
                Enter your registered administrator email address (<span className="font-medium text-forest-800">sanaullah.ccs@gmail.com</span>). Usernames like &quot;admin&quot; are not valid email addresses.
              </p>
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
