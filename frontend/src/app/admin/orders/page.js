'use client';
import AdminShell from '../AdminShell';
import { useEffect, useState, useCallback } from 'react';
import { adminOrders } from '@/lib/adminApi';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExpandMore,
  Close,
} from '@mui/icons-material';

const STATUS_OPTIONS = ['pending', 'success', 'active', 'cancel', 'failed'];
const ORDER_STAGES = [
  { key: 'orderConfirm', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'outForDelivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

const statusColor = {
  success: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  cancel: 'bg-red-50 text-red-700',
  failed: 'bg-red-50 text-red-600',
  active: 'bg-blue-50 text-blue-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [paginator, setPaginator] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [detailOrder, setDetailOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const query = {};
      if (statusFilter) query.status = statusFilter;
      if (search) query.orderId = { $regex: search, $options: 'i' };
      const res = await adminOrders.list(page, 10, query);
      if (res.data?.data) {
        setOrders(res.data.data.data || []);
        setPaginator(res.data.data.paginator || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await adminOrders.update(orderId, { status: newStatus });
      fetchOrders();
      if (detailOrder?.id === orderId) {
        setDetailOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updateProductStage = async (orderId, productIndex, stageKey) => {
    setUpdatingStatus(true);
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      const updatedProducts = [...order.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        orderStatus: {
          ...updatedProducts[productIndex].orderStatus,
          [stageKey]: { isConfirmed: true, date: new Date().toISOString() },
        },
      };
      await adminOrders.update(orderId, { products: updatedProducts });
      fetchOrders();
    } catch {
      alert('Failed to update');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {paginator.itemCount ?? 0} total orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative">
            <Search
              sx={{ fontSize: 18 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search order ID..."
              className="w-60 h-10 pl-9 pr-4 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-400"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-neutral-400">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-400">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 text-xs">
                    <th className="text-left font-medium px-5 py-3">Order ID</th>
                    <th className="text-left font-medium px-5 py-3">Customer</th>
                    <th className="text-left font-medium px-5 py-3">Items</th>
                    <th className="text-left font-medium px-5 py-3">Status</th>
                    <th className="text-left font-medium px-5 py-3">Address</th>
                    <th className="text-left font-medium px-5 py-3">Date</th>
                    <th className="text-right font-medium px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-neutral-800">
                        {o.orderId || o.id?.slice(-8)}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {o.userId?.name || o.userId?.email || '-'}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {o.products?.length || 0} items
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                            statusColor[o.status] || 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-neutral-500 max-w-[160px] truncate">
                        {o.address ? `${o.address.city || ''}, ${o.address.state || ''}` : '-'}
                      </td>
                      <td className="px-5 py-3 text-neutral-500">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setDetailOrder(o)}
                          className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {paginator.pageCount > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 text-sm">
              <span className="text-neutral-500">
                Page {paginator.currentPage} of {paginator.pageCount}
              </span>
              <div className="flex gap-1">
                <button
                  disabled={!paginator.prev}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronLeft sx={{ fontSize: 18 }} />
                </button>
                <button
                  disabled={!paginator.next}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronRight sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      {detailOrder && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setDetailOrder(null)}
          />
          <div className="relative bg-white w-full max-w-lg shadow-2xl h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-neutral-900">
                Order {detailOrder.orderId || detailOrder.id?.slice(-8)}
              </h2>
              <button
                onClick={() => setDetailOrder(null)}
                className="p-1 rounded-lg hover:bg-neutral-100"
              >
                <Close sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status update */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Order Status
                </label>
                <select
                  value={detailOrder.status}
                  disabled={updatingStatus}
                  onChange={(e) => updateOrderStatus(detailOrder.id, e.target.value)}
                  className="h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 w-full"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Customer
                </label>
                <div className="bg-neutral-50 rounded-xl p-3 text-sm">
                  <p className="font-medium text-neutral-800">
                    {detailOrder.userId?.name || '-'}
                  </p>
                  <p className="text-neutral-500">{detailOrder.userId?.email || '-'}</p>
                  <p className="text-neutral-500">{detailOrder.userId?.phone || '-'}</p>
                </div>
              </div>

              {/* Address */}
              {detailOrder.address && (
                <div>
                  <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    Shipping Address
                  </label>
                  <div className="bg-neutral-50 rounded-xl p-3 text-sm text-neutral-700">
                    {detailOrder.address.locality && <p>{detailOrder.address.locality}</p>}
                    <p>
                      {[detailOrder.address.city, detailOrder.address.state].filter(Boolean).join(', ')}
                    </p>
                    <p>
                      {[detailOrder.address.country, detailOrder.address.zipcode].filter(Boolean).join(' - ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Products */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Products ({detailOrder.products?.length || 0})
                </label>
                <div className="space-y-3">
                  {detailOrder.products?.map((item, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-xl p-3">
                      <div className="flex items-center gap-3 mb-3">
                        {item.productId?.image && (
                          <img
                            src={item.productId.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-200"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-800 truncate">
                            {item.productId?.title?.shortTitle || 'Product'}
                          </p>
                          <p className="text-xs text-neutral-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ORDER_STAGES.map((stage) => {
                          const done = item.orderStatus?.[stage.key]?.isConfirmed;
                          return (
                            <button
                              key={stage.key}
                              disabled={done || updatingStatus}
                              onClick={() => updateProductStage(detailOrder.id, idx, stage.key)}
                              className={`text-[11px] font-medium px-2 py-1 rounded-lg transition-colors ${
                                done
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                              }`}
                            >
                              {stage.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
