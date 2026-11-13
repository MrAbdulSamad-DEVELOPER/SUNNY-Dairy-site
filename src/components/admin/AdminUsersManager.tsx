'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Check, AlertCircle, User, Lock, Mail } from 'lucide-react';

export default function AdminUsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (e) {
      console.error(e);
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
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setMessage(`Staff account @${username} created successfully!`);
        setUsername('');
        setEmail('');
        setPassword('');
        fetchUsers();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this admin staff user?')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderCream">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            Access Control
          </span>
          <h1 className="font-serif text-3xl font-bold text-forest-800">
            Staff & Administrator Management
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Manage authorized staff accounts with role-based access control and bcrypt password encryption.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Admin User</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 text-xs font-medium flex items-center space-x-2">
          <Check className="w-4 h-4 text-forest-700" />
          <span>{message}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#FFFDFA] rounded-3xl border border-borderCream shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading staff users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/70 border-b border-borderCream text-forest-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Username</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderCream/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-forest-900">@{u.username}</td>
                    <td className="py-4 px-4 text-muted">{u.email}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold uppercase tracking-wider">
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
                    <td className="py-4 px-4 sm:px-6 text-right">
                      {u.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Remove user"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDFA] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-borderCream shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-forest-800 pb-2 border-b border-borderCream">
              Add New Staff User
            </h3>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Password (min 8 chars) *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-800 uppercase tracking-wider mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderCream bg-white font-semibold"
                >
                  <option value="ADMIN">Administrator (Full catalog & orders)</option>
                  <option value="MANAGER">Manager (Orders & dispatch only)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-borderCream">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-borderCream text-muted font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-forest-800 text-white font-bold"
                >
                  {saving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
