'use client';

import React, { useState, useEffect } from 'react';
import { Users, Phone, MessageSquare, MapPin } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function CustomersManager() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCustomers(data.customers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-borderCream">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
          Client Directory
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest-800">
          Customer Directory & History
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Real customer contacts and ordering frequency recorded from genuine customer checkouts.
        </p>
      </div>

      <div className="bg-[#FFFDFA] rounded-3xl border border-borderCream shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading customer directory...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm space-y-2">
            <Users className="w-10 h-10 text-muted/40 mx-auto" />
            <p className="font-bold text-forest-800">No customer records yet.</p>
            <p className="text-xs text-muted">When customers place orders, their contact details will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/70 border-b border-borderCream text-forest-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Customer Name</th>
                  <th className="py-3.5 px-4">Calling Phone</th>
                  <th className="py-3.5 px-4">WhatsApp</th>
                  <th className="py-3.5 px-4">Area / City</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderCream/60">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-forest-900">{c.fullName}</td>
                    <td className="py-4 px-4 text-muted font-mono">{c.phone}</td>
                    <td className="py-4 px-4 text-muted font-mono">{c.whatsapp}</td>
                    <td className="py-4 px-4 text-muted">
                      {c.orders[0]?.area || '—'}, {c.orders[0]?.city || 'Dera Ismail Khan'}
                    </td>
                    <td className="py-4 px-4 font-bold text-forest-800">
                      {c._count.orders} order(s)
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right space-x-2">
                      <a
                        href={getWhatsAppUrl(
                          `Hello ${c.fullName}! This is Sanaullah from SUNNY Dairy. How can we assist you today?`,
                          c.whatsapp
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-green-50 text-green-800 hover:bg-green-100 inline-flex items-center space-x-1 font-semibold"
                      >
                        <MessageSquare className="w-3 h-3 text-green-700" />
                        <span>Chat</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
