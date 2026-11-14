import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticatedAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ShoppingCart, Clock, CheckCircle2, Truck, Banknote, ArrowRight, Package, TrendingUp } from 'lucide-react';
import { OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardOverviewPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  // Fetch live stats strictly from DB in parallel for ultra-fast load
  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    confirmedSales,
    recentOrders,
    topItems,
    totalProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: {
        orderStatus: { in: ['PENDING', 'PRICE_CONFIRMATION_REQUIRED'] },
      },
    }),
    prisma.order.count({
      where: { orderStatus: 'CONFIRMED' },
    }),
    prisma.order.count({
      where: { orderStatus: 'DELIVERED' },
    }),
    prisma.order.aggregate({
      where: {
        orderStatus: { in: ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] },
      },
      _sum: {
        subtotal: true,
        finalTotal: true,
      },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    }),
    prisma.orderItem.groupBy({
      by: ['productNameSnapshot'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    prisma.product.count(),
  ]);

  const totalSalesAmount =
    confirmedSales._sum.finalTotal || confirmedSales._sum.subtotal || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-borderCream">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-forest-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Store performance overview, live orders, and product sales statistics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/orders"
            className="px-3.5 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/admin/products"
            className="px-3.5 py-2 bg-gold-500 hover:bg-gold-600 text-forest-950 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Products
          </Link>
        </div>
      </div>

      {/* 5 Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#FFFDFA] p-5 rounded-2xl border border-borderCream shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-forest-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-forest-800">{totalOrders}</div>
          <span className="text-[11px] text-muted">Real database records</span>
        </div>

        <div className="bg-[#FFFDFA] p-5 rounded-2xl border border-borderCream shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gold-700">
            <span className="text-xs font-semibold uppercase">Pending Action</span>
            <Clock className="w-4 h-4 text-gold-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-gold-700">{pendingOrders}</div>
          <span className="text-[11px] text-muted">Awaiting price / dispatch check</span>
        </div>

        <div className="bg-[#FFFDFA] p-5 rounded-2xl border border-borderCream shadow-sm space-y-2">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-semibold uppercase">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-forest-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-forest-800">{confirmedOrders}</div>
          <span className="text-[11px] text-muted">Ready for morning run</span>
        </div>

        <div className="bg-[#FFFDFA] p-5 rounded-2xl border border-borderCream shadow-sm space-y-2">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-semibold uppercase">Delivered</span>
            <Truck className="w-4 h-4 text-forest-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-forest-800">{deliveredOrders}</div>
          <span className="text-[11px] text-muted">Completed deliveries</span>
        </div>

        <div className="bg-[#FFFDFA] p-5 rounded-2xl border border-borderCream shadow-sm space-y-2">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-semibold uppercase">Confirmed Sales</span>
            <Banknote className="w-4 h-4 text-gold-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-forest-800">
            Rs {totalSalesAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-muted">Excludes unpriced pending items</span>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-8 bg-[#FFFDFA] p-6 sm:p-8 rounded-3xl border border-borderCream shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-borderCream">
            <div>
              <h3 className="font-serif text-xl font-bold text-forest-800">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-muted">Actual customer orders from database</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-forest-800 hover:text-gold-700 flex items-center space-x-1"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-16 text-muted space-y-3">
              <ShoppingCart className="w-10 h-10 mx-auto text-forest-800/30" />
              <p className="text-sm font-semibold text-forest-900">No orders yet.</p>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Customer orders placed on the website or via WhatsApp will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-borderCream/60">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-forest-900 text-sm">
                        #{ord.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : ord.orderStatus === 'PRICE_CONFIRMATION_REQUIRED'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.orderStatus === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-cream-200 text-forest-800'
                        }`}
                      >
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                      {ord.cancellationRequested && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-red-100 text-red-800">
                          Cancel Req
                        </span>
                      )}
                    </div>

                    <p className="font-medium text-forest-800">
                      {ord.customerName} · {ord.customerPhone} ({ord.area})
                    </p>

                    <div className="text-muted text-[11px]">
                      {ord.items.map((i) => `${i.productNameSnapshot} (${i.selectedVariant}×${i.quantity})`).join(', ')}
                    </div>
                  </div>

                  <div className="flex sm:flex-col sm:items-end justify-between items-center">
                    <div className="font-serif font-bold text-sm text-forest-800">
                      {ord.finalTotal !== null ? (
                        `Rs ${ord.finalTotal.toLocaleString()}`
                      ) : ord.subtotal > 0 ? (
                        `Rs ${ord.subtotal.toLocaleString()} + Pending`
                      ) : (
                        'Price on Request'
                      )}
                    </div>

                    <Link
                      href={`/admin/orders?search=${ord.orderNumber}`}
                      className="mt-1 text-gold-700 hover:text-gold-800 font-semibold text-[11px]"
                    >
                      Manage & Confirm →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Best Sellers & Catalog Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FFFDFA] p-6 rounded-3xl border border-borderCream shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-borderCream">
              <TrendingUp className="w-4 h-4 text-forest-800" />
              <h3 className="font-serif text-lg font-bold text-forest-800">
                Top Ordered Products
              </h3>
            </div>

            {topItems.length === 0 ? (
              <p className="text-xs text-muted py-6 text-center">
                Real sales rankings will calculate as orders are placed.
              </p>
            ) : (
              <div className="space-y-3">
                {topItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-forest-800">
                      {idx + 1}. {item.productNameSnapshot}
                    </span>
                    <span className="font-bold text-gold-700 bg-cream-100 px-2 py-0.5 rounded-full">
                      {item._sum.quantity} units sold
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-forest-800 text-cream-100 p-6 rounded-3xl border border-forest-700 space-y-3 shadow-md">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gold-400" />
              <h4 className="font-serif text-lg font-bold text-white">Catalog Status</h4>
            </div>
            <p className="text-xs text-forest-200">
              {totalProducts} products currently active in your farm catalog across 4 categories.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/products"
                className="inline-block w-full text-center py-2.5 px-4 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold rounded-xl text-xs transition-colors"
              >
                Manage Products & Edit Prices
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
