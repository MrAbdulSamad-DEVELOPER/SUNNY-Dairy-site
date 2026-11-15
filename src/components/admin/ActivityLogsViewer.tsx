'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ActivityLogDTO } from '@/types';
import {
  History,
  Shield,
  RefreshCw,
  Search,
  Filter,
  User,
  Package,
  Boxes,
  ShoppingCart,
  AlertTriangle,
  BookOpen,
  Settings,
  Layers,
  KeyRound,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function ActivityLogsViewer() {
  const [logs, setLogs] = useState<ActivityLogDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/activity?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error('Failed to load activity logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionMeta = (action: string) => {
    const act = action.toUpperCase();

    if (act.includes('LOGIN')) {
      return {
        label: 'Staff Login',
        icon: KeyRound,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        badgeBg: 'bg-blue-100/80 text-blue-900',
      };
    }
    if (act.includes('CANCEL')) {
      return {
        label: 'Cancel Request',
        icon: AlertTriangle,
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-200',
        badgeBg: 'bg-rose-100/80 text-rose-900',
      };
    }
    if (act.includes('STOCK')) {
      return {
        label: 'Stock Adjustment',
        icon: Boxes,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        badgeBg: 'bg-amber-100/80 text-amber-900',
      };
    }
    if (act.includes('PRODUCT')) {
      return {
        label: act.includes('CREATE') ? 'Product Created' : act.includes('DELETE') ? 'Product Deleted' : 'Product Updated',
        icon: Package,
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        badgeBg: 'bg-emerald-100/80 text-emerald-900',
      };
    }
    if (act.includes('CATEGORY')) {
      return {
        label: act.includes('CREATE') ? 'Category Created' : 'Category Updated',
        icon: Layers,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        badgeBg: 'bg-purple-100/80 text-purple-900',
      };
    }
    if (act.includes('BLOG')) {
      return {
        label: act.includes('CREATE') ? 'Blog Created' : act.includes('DELETE') ? 'Blog Deleted' : 'Blog Updated',
        icon: BookOpen,
        bgColor: 'bg-gold-50',
        textColor: 'text-gold-700',
        borderColor: 'border-gold-300',
        badgeBg: 'bg-gold-100/80 text-forest-900',
      };
    }
    if (act.includes('CMS') || act.includes('CONTENT')) {
      return {
        label: 'Website CMS Update',
        icon: Sparkles,
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-700',
        borderColor: 'border-teal-200',
        badgeBg: 'bg-teal-100/80 text-teal-900',
      };
    }
    if (act.includes('PROFILE') || act.includes('USER')) {
      return {
        label: 'Profile / Staff Update',
        icon: User,
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        borderColor: 'border-indigo-200',
        badgeBg: 'bg-indigo-100/80 text-indigo-900',
      };
    }
    if (act.includes('ORDER')) {
      return {
        label: 'Order Processed',
        icon: ShoppingCart,
        bgColor: 'bg-forest-50',
        textColor: 'text-forest-700',
        borderColor: 'border-forest-200',
        badgeBg: 'bg-forest-100 text-forest-900',
      };
    }

    return {
      label: action.replace(/_/g, ' '),
      icon: History,
      bgColor: 'bg-forest-50',
      textColor: 'text-forest-700',
      borderColor: 'border-forest-200',
      badgeBg: 'bg-forest-100/70 text-forest-800',
    };
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        log.adminUsername.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        (log.details && log.details.toLowerCase().includes(query)) ||
        (log.entityType && log.entityType.toLowerCase().includes(query));

      const matchesFilter =
        filterAction === 'ALL' ||
        (filterAction === 'AUTH' && log.action.toUpperCase().includes('LOGIN')) ||
        (filterAction === 'PRODUCTS' && (log.action.toUpperCase().includes('PRODUCT') || log.action.toUpperCase().includes('STOCK'))) ||
        (filterAction === 'ORDERS' && (log.action.toUpperCase().includes('ORDER') || log.action.toUpperCase().includes('CANCEL'))) ||
        (filterAction === 'CONTENT' && (log.action.toUpperCase().includes('BLOG') || log.action.toUpperCase().includes('CMS')));

      return matchesSearch && matchesFilter;
    });
  }, [logs, searchQuery, filterAction]);

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200 min-w-0 max-w-full">
        <div className="min-w-0 max-w-full">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Shield className="w-3.5 h-3.5 text-forest-700" />
            <span>Audit Trail &amp; Activity Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900 tracking-tight break-words">
            Activity &amp; Operations Logs
          </h1>
          <p className="text-xs sm:text-sm text-forest-600 mt-1 max-w-2xl break-words leading-relaxed">
            Real-time immutable audit trail recording staff sign-ins, catalog modifications, price updates, stock adjustments, and order workflows.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-forest-900 bg-white border border-forest-200 hover:bg-forest-50 hover:border-forest-300 shadow-xs transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold-600' : 'text-forest-600'}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Logs'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-cream-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-forest-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by admin (@admin), action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-800/20 text-forest-900 placeholder-forest-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-bold rounded-xl border border-forest-200 bg-white text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
          >
            <option value="ALL">All Event Types</option>
            <option value="ORDERS">Orders &amp; Cancels</option>
            <option value="PRODUCTS">Products &amp; Stock</option>
            <option value="CONTENT">Blogs &amp; CMS</option>
            <option value="AUTH">Staff Logins</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-forest-500">
            <div className="w-8 h-8 border-3 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs sm:text-sm font-medium">Loading audit trail...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <History className="w-10 h-10 text-forest-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-forest-900">No logs found</h3>
            <p className="text-xs text-forest-500 max-w-sm mx-auto">
              No activity logs match your current search criteria.
            </p>
          </div>
        ) : (
          <>
            {/* 1. MOBILE TIMELINE CARDS VIEW (Clean, readable, zero table squeeze) */}
            <div className="block md:hidden p-3 sm:p-4 space-y-3 w-full max-w-full min-w-0">
              {filteredLogs.map((log) => {
                const meta = getActionMeta(log.action);
                const Icon = meta.icon;

                return (
                  <div
                    key={log.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-cream-50/60 border border-cream-200/90 space-y-2.5 transition-all hover:bg-white hover:shadow-xs w-full max-w-full min-w-0 box-border"
                  >
                    {/* Top Row: Event Icon + Action Label + Timestamp */}
                    <div className="flex items-start justify-between gap-2 w-full min-w-0">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl ${meta.bgColor} ${meta.borderColor} border flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className={`w-4 h-4 ${meta.textColor}`} />
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${meta.badgeBg} truncate max-w-[140px]`}
                          >
                            {meta.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-[11px] text-forest-500 whitespace-nowrap flex-shrink-0 font-mono">
                        <Clock className="w-3 h-3 text-forest-400" />
                        <span>
                          {new Date(log.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Full Details text */}
                    <div className="text-xs text-forest-800 leading-relaxed font-medium break-words">
                      {log.details || 'System event recorded.'}
                    </div>

                    {/* Bottom Row: Actor & Entity Tags */}
                    <div className="pt-2 border-t border-cream-200/50 flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-1 text-forest-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-bold">@{log.adminUsername}</span>
                      </div>

                      <span className="font-mono text-[10px] text-forest-500 bg-white px-2 py-0.5 rounded-md border border-cream-200 uppercase font-semibold">
                        {log.entityType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. DESKTOP EXPANDED TABLE VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-forest-50/70 border-b border-cream-200 text-forest-800 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-6">Timestamp</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">Administrator</th>
                    <th className="py-3.5 px-4">Entity</th>
                    <th className="py-3.5 px-6">Event Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {filteredLogs.map((log) => {
                    const meta = getActionMeta(log.action);
                    const Icon = meta.icon;

                    return (
                      <tr key={log.id} className="hover:bg-cream-50/60 transition-colors">
                        {/* Timestamp */}
                        <td className="py-3.5 px-6 text-forest-600 font-mono whitespace-nowrap text-[11px]">
                          {new Date(log.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>

                        {/* Action with Icon */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="inline-flex items-center space-x-1.5">
                            <span
                              className={`w-6 h-6 rounded-lg ${meta.bgColor} ${meta.borderColor} border flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`w-3.5 h-3.5 ${meta.textColor}`} />
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${meta.badgeBg}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                        </td>

                        {/* Administrator */}
                        <td className="py-3.5 px-4 font-bold text-forest-900 whitespace-nowrap">
                          <span className="inline-flex items-center space-x-1 text-forest-800 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>@{log.adminUsername}</span>
                          </span>
                        </td>

                        {/* Entity */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono text-[11px] text-forest-600 font-semibold uppercase bg-cream-50 px-2 py-0.5 rounded border border-cream-200">
                            {log.entityType}
                          </span>
                        </td>

                        {/* Details */}
                        <td className="py-3.5 px-6 text-forest-800 max-w-lg leading-relaxed font-medium">
                          {log.details || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
