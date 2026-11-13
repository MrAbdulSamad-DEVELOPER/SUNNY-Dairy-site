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
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* Clean Header */}
      <div className="pb-3 border-b border-borderCream">
        <h1 className="text-xl sm:text-2xl font-bold text-forest-900 tracking-tight">
          Customers
        </h1>
        <p className="text-xs text-muted mt-0.5">
          Real customer contacts and ordering frequency recorded from genuine customer checkouts.
        </p>
      </div>

      <div className="bg-[#FFFDFA] rounded-2xl sm:rounded-3xl border border-borderCream shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading customer directory...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm space-y-2">
            <Users className="w-10 h-10 text-muted/40 mx-auto" />
            <p className="font-bold text-forest-800">No customer records yet.</p>
            <p className="text-xs text-muted">When customers place orders, their contact details will appear here automatically.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card List View (< 768px) */}
            <div className="block md:hidden divide-y divide-borderCream/70">
              {customers.map((c) => (
                <div key={c.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-forest-900 text-sm">{c.fullName}</h4>
                      <p className="text-xs text-muted mt-0.5">
                        📍 {c.orders[0]?.area || '—'}, {c.orders[0]?.city || 'Pakistan'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold bg-forest-50 text-forest-800 px-2.5 py-1 rounded-full border border-forest-200/50 flex-shrink-0">
                      {c._count.orders} order(s)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-borderCream/50 text-xs">
                    <div className="font-mono text-muted text-[11px]">
                      <span>📞 {c.phone}</span>
                    </div>

                    <a
                      href={getWhatsAppUrl(
                        `Hello ${c.fullName}! This is Sanaullah from SUNNY Dairy. How can we assist you today?`,
                        c.whatsapp
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-green-50 text-green-800 hover:bg-green-100 inline-flex items-center space-x-1.5 font-semibold text-xs transition-colors border border-green-200/60"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-green-700" />
                      <span>WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
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
        </>
      )}
    </div>
    </div>
  );
}
