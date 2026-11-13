'use client';

import React, { useState, useEffect } from 'react';
import { ActivityLogDTO } from '@/types';
import { History, Shield, RefreshCw } from 'lucide-react';

export default function ActivityLogsViewer() {
  const [logs, setLogs] = useState<ActivityLogDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/activity');
      const data = await res.json();
      if (data.success) setLogs(data.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderCream">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            Security & Audit
          </span>
          <h1 className="font-serif text-3xl font-bold text-forest-800">
            Administrator Activity Logs
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Tamper-evident system activity log recording all staff logins, catalog changes, order updates, and setting edits.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-4 py-2 border border-borderCream text-forest-800 rounded-xl text-xs font-bold hover:bg-cream-100 flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="bg-[#FFFDFA] rounded-3xl border border-borderCream shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm">No activity recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/70 border-b border-borderCream text-forest-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4 sm:px-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderCream/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 text-muted whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-forest-900">
                      @{log.adminUsername}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 font-mono font-bold text-[10px] uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted font-medium">{log.entityType}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-forest-800 max-w-md truncate">
                      {log.details || '—'}
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
