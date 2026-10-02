'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@/redux/slices/auth';
import { getOrder } from '@/redux/slices/order';
import UserDashboardLayout from '@/contents/myAccount/UserDashboardLayout';
import {
  ShoppingBag,
  Schedule,
  LocalShipping,
  CheckCircle,
  Cancel,
  InboxOutlined,
  ArrowForward,
} from '@mui/icons-material';

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', icon: Schedule },
  active: { label: 'Active', bg: 'bg-blue-50', text: 'text-blue-700', icon: LocalShipping },
  success: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  cancel: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', icon: Cancel },
  failed: { label: 'Failed', bg: 'bg-red-50', text: 'text-red-600', icon: Cancel },
};

const Order = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { orders } = useSelector((state) => state.order);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      await dispatch(getUser());
      await dispatch(getOrder(1, 50));
      setLoading(false);
    };
    load();
  }, [dispatch]);

  const filteredOrders = filter === 'all'
    ? orders
    : orders?.filter((o) => o.status === filter) || [];

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'active', label: 'Active' },
    { key: 'success', label: 'Delivered' },
    { key: 'cancel', label: 'Cancelled' },
  ];

  return (
    <UserDashboardLayout title="My Orders" subtitle={`${orders?.length || 0} total orders`}>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              filter === tab.key
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-20 h-24 bg-neutral-100 rounded-xl" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  <div className="h-3 bg-neutral-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((order) =>
            order.products?.map((item, idx) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <div
                  key={`${order.id}-${idx}`}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all"
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-500">
                        Order #{order.orderId || order.id?.slice(-8)}
                      </span>
                      {order.createdAt && (
                        <span className="text-xs text-neutral-400">
                          · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${status.bg} ${status.text}`}>
                      <StatusIcon sx={{ fontSize: 13 }} />
                      {status.label}
                    </span>
                  </div>

                  {/* Order body */}
                  <div
                    onClick={() => router.push(`/orderDetails/${order.id}`)}
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                      {item.productId?.image ? (
                        <img
                          src={item.productId.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag sx={{ fontSize: 24, color: '#d4d4d4' }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-neutral-800 truncate">
                        {item.productId?.title?.shortTitle || 'Product'}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">
                        {item.productId?.title?.longTitle}
                      </p>
                      {item.productId?.price?.cost && (
                        <p className="text-base font-bold text-neutral-900 mt-2">
                          ₹{item.productId.price.cost.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-neutral-400 mt-1">Qty: {item.qty || 1}</p>
                    </div>
                    <div className="shrink-0 hidden sm:block">
                      <span className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                        Details <ArrowForward sx={{ fontSize: 12 }} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <InboxOutlined sx={{ fontSize: 28, color: '#d4d4d4' }} />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </h2>
          <p className="text-sm text-neutral-400 mt-1.5">
            {filter === 'all'
              ? "You haven't placed any orders yet. Start shopping to see them here."
              : 'Try a different filter to see your orders.'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => router.push('/')}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Start Shopping <ArrowForward sx={{ fontSize: 16 }} />
            </button>
          )}
        </div>
      )}
    </UserDashboardLayout>
  );
};

export default Order;
