'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, ShoppingBag, Banknote } from 'lucide-react';

export default function ReportsViewer() {
  const [range, setRange] = useState('30');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?range=${range}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      const data = await res.json();
      if (data.success) {
        setReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [range]);

  const handleExportCSV = () => {
    if (!report || !report.orders || report.orders.length === 0) {
      alert('No orders to export for the selected period.');
      return;
    }

    const headers = ['Order Number', 'Date', 'Customer', 'Phone', 'Area', 'Status', 'Total (PKR)'];
    const rows = report.orders.map((o: any) => [
      o.orderNumber,
      new Date(o.date).toISOString().split('T')[0],
      `"${o.customerName}"`,
      o.customerPhone,
      `"${o.area}"`,
      o.status,
      o.total,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sunny-dairy-orders-${range}days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-borderCream">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-forest-900 tracking-tight">
            Sales Reports
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Real sales totals, order volume, and top-selling dairy products.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-borderCream bg-white text-xs font-bold text-forest-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last 1 Year</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-gold-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted text-sm">Generating reports...</div>
      ) : !report || report.totalOrders === 0 ? (
        <div className="text-center py-16 bg-[#FFFDFA] rounded-3xl border border-borderCream p-8 space-y-3">
          <div className="w-14 h-14 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-forest-800/40">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-forest-800">No Orders in this Period</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Actual customer orders placed through the website or WhatsApp will be aggregated into daily, weekly, and monthly reports.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#FFFDFA] p-6 rounded-3xl border border-borderCream shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted block">
                Total Orders Placed
              </span>
              <div className="font-serif text-3xl font-bold text-forest-800">
                {report.totalOrders}
              </div>
              <p className="text-[11px] text-muted">In selected time range</p>
            </div>

            <div className="bg-[#FFFDFA] p-6 rounded-3xl border border-borderCream shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 block">
                Confirmed / Placed Revenue
              </span>
              <div className="font-serif text-3xl font-bold text-forest-800">
                Rs {report.totalRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-muted">Estimated order pipeline value</p>
            </div>

            <div className="bg-[#FFFDFA] p-6 rounded-3xl border border-borderCream shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-green-700 block">
                Completed & Delivered Sales
              </span>
              <div className="font-serif text-3xl font-bold text-green-800">
                Rs {report.deliveredRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-muted">Successfully fulfilled orders</p>
            </div>
          </div>

          {/* Top Products Breakdown */}
          <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-8 border border-borderCream shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-forest-800">
              Product Performance in Period
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-borderCream text-forest-800 font-bold uppercase text-[11px]">
                    <th className="py-2">Product</th>
                    <th className="py-2">Units Sold</th>
                    <th className="py-2">Calculated Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderCream/60">
                  {report.topProducts.map((p: any, idx: number) => (
                    <tr key={idx} className="hover:bg-cream-50/50">
                      <td className="py-3 font-semibold text-forest-900">{p.name}</td>
                      <td className="py-3 text-muted">{p.quantity} units</td>
                      <td className="py-3 font-serif font-bold text-forest-800">
                        Rs {p.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
