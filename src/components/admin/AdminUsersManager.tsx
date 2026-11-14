'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Check, AlertCircle, User, Lock, Mail, KeyRound, RefreshCw, X } from 'lucide-react';

export default function AdminUsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        if (data.currentUser) setCurrentUser(data.currentUser);
      } else {
        setError(data.error);
      }
    } catch (e: any) {
      console.error(e);
      setError('Could not connect to users service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setMessage(`Staff account @${data.user.username} created successfully! They can now log in immediately.`);
        setUsername('');
        setEmail('');
        setPassword('');
        fetchUsers();
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (e: any) {
      setError(e.message || 'Network error creating user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete administrator @${name}?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage(`Admin account @${name} removed successfully.`);
        fetchUsers();
      } else {
        setError(data.error || 'Failed to delete user');
      }
    } catch (e: any) {
      setError(e.message || 'Error deleting account');
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-borderCream">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-forest-900 tracking-tight">
            Staff & Administrators
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Manage authorized staff accounts with role-based access control and secure password protection.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchUsers()}
            title="Refresh accounts"
            className="p-2 border border-borderCream rounded-xl bg-white hover:bg-cream-100 text-forest-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setError(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Add Admin User</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 text-xs font-medium flex items-center space-x-2 border border-forest-200">
          <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 text-red-900 text-xs font-medium flex items-center space-x-2 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Users Container */}
      <div className="bg-[#FFFDFA] rounded-2xl sm:rounded-3xl border border-borderCream shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading staff users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm space-y-2">
            <Shield className="w-10 h-10 text-muted/40 mx-auto" />
            <p className="font-bold text-forest-800">No admin accounts found.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card List View (< 768px) */}
            <div className="block md:hidden divide-y divide-borderCream/70">
              {users.map((u) => (
                <div key={u.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-bold text-forest-900 text-sm">@{u.username}</h4>
                        {currentUser?.username === u.username && (
                          <span className="text-[10px] bg-gold-200/60 text-gold-900 font-bold px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">{u.email}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-800 px-2.5 py-1 rounded-full flex-shrink-0">
                      {u.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-borderCream/50 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-muted">
                        {u.isActive ? 'Active' : 'Disabled'} · {u.lastLoginAt ? `Login: ${new Date(u.lastLoginAt).toLocaleDateString('en-GB')}` : 'Never logged in'}
                      </span>
                    </div>

                    {u.role !== 'SUPER_ADMIN' && currentUser?.role === 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleDelete(u.id, u.username)}
                        className="px-3 py-1 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-100/70 border-b border-borderCream text-forest-900 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Username</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Last Login</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderCream/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-forest-900">@{u.username}</span>
                          {currentUser?.username === u.username && (
                            <span className="text-[10px] bg-gold-200/60 text-gold-900 font-bold px-1.5 py-0.5 rounded">
                              Current User
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold uppercase tracking-wider">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-GB') : 'Never'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold uppercase">
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {u.role !== 'SUPER_ADMIN' && currentUser?.role === 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleDelete(u.id, u.username)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            title="Remove user"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end sm:justify-center sm:items-center sm:p-4 overflow-hidden">
          <div className="bg-[#FFFDFA] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-borderCream shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-150">
            <div className="flex-shrink-0 px-5 py-4 border-b border-borderCream flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-forest-900">
                Add New Staff User
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-cream-100 text-muted hover:text-forest-900 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form id="admin-user-form" onSubmit={handleCreate} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. staff1"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                  <User className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. staff@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                  <Mail className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Password (min 6 chars) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter staff password"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderCream bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-forest-800"
                >
                  <option value="ADMIN">Administrator (Full catalog & orders)</option>
                  <option value="MANAGER">Manager (Orders & dispatch)</option>
                </select>
              </div>
            </form>

            <div className="flex-shrink-0 px-5 py-3.5 border-t border-borderCream bg-cream-50 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-borderCream text-xs font-semibold text-muted hover:text-forest-900 hover:bg-cream-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="admin-user-form"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all flex items-center space-x-1.5"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
