'use client';
import AdminShell from '../AdminShell';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  adminUsers,
  adminProducts,
  adminOrders,
  adminPayments,
} from '@/lib/adminApi';
import {
  People,
  Inventory2,
  ShoppingCart,
  Payment,
  TrendingUp,
  ArrowForward,
} from '@mui/icons-material';

function StatCard({ icon: Icon, label, value, color, href, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-neutral-200 p-5 text-left hover:shadow-md hover:border-neutral-300 transition-all group w-full"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon sx={{ fontSize: 22, color }} />
        </div>
        <ArrowForward
          sx={{ fontSize: 16 }}
          className="text-neutral-300 group-hover:text-neutral-500 transition-colors"
        />
      </div>
      <p className="mt-4 text-2xl font-semibold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500 mt-0.5">{label}</p>
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: '-',
    products: '-',
    orders: '-',
    payments: '-',
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [uRes, pRes, oRes, pmRes, ordersRes] = await Promise.all([
          adminUsers.count(),
          adminProducts.count(),
          adminOrders.count(),
          adminPayments.count(),
          adminOrders.list(1, 5),
        ]);

        setStats({
          users:
            uRes.data?.data?.totalRecords ??
            uRes.data?.data?.itemCount ??
            0,
          products:
            pRes.data?.data?.totalRecords ??
            pRes.data?.data?.itemCount ??
            0,
          orders:
            oRes.data?.data?.totalRecords ??
            oRes.data?.data?.itemCount ??
            0,
          payments:
            pmRes.data?.data?.totalRecords ??
            pmRes.data?.data?.itemCount ??
            0,
        });

        if (ordersRes.data?.data?.data) {
          setRecentOrders(ordersRes.data.data.data);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoadingStats(false);
      }
    }
    load();
  }, []);

  const statusColor = {
    success: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    cancel: 'bg-red-50 text-red-700',
    failed: 'bg-red-50 text-red-600',
    active: 'bg-blue-50 text-blue-700',
  };

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Overview of your store
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={People}
            label="Total Users"
            value={loadingStats ? '...' : stats.users}
            color="#6366f1"
            onClick={() => router.push('/admin/users')}
          />
          <StatCard
            icon={Inventory2}
            label="Total Products"
            value={loadingStats ? '...' : stats.products}
            color="#0ea5e9"
            onClick={() => router.push('/admin/products')}
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={loadingStats ? '...' : stats.orders}
            color="#f59e0b"
            onClick={() => router.push('/admin/orders')}
          />
          <StatCard
            icon={Payment}
            label="Payments"
            value={loadingStats ? '...' : stats.payments}
            color="#10b981"
            onClick={() => router.push('/admin/payments')}
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">
              Recent Orders
            </h2>
            <button
              onClick={() => router.push('/admin/orders')}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-700 flex items-center gap-1"
            >
              View all <ArrowForward sx={{ fontSize: 12 }} />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-400">
              {loadingStats ? 'Loading...' : 'No orders yet'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 text-xs">
                    <th className="text-left font-medium px-5 py-3">
                      Order ID
                    </th>
                    <th className="text-left font-medium px-5 py-3">
                      Customer
                    </th>
                    <th className="text-left font-medium px-5 py-3">
                      Products
                    </th>
                    <th className="text-left font-medium px-5 py-3">Status</th>
                    <th className="text-left font-medium px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => router.push('/admin/orders')}
                    >
                      <td className="px-5 py-3 font-medium text-neutral-800">
                        {order.orderId || order.id?.slice(-8)}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {order.userId?.name || order.userId?.email || '-'}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {order.products?.length || 0} items
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                            statusColor[order.status] || 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-neutral-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
