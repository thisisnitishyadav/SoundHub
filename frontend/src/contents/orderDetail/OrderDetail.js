'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@/redux/slices/auth';
import { getSingleOrder, updateOrder } from '@/redux/slices/order';
import UserDashboardLayout from '@/contents/myAccount/UserDashboardLayout';
import dayjs from 'dayjs';
import {
  ArrowBack,
  CheckCircle,
  RadioButtonUnchecked,
  ShoppingBag,
  LocalShipping,
  Inventory2,
  Receipt,
  Schedule,
  Cancel,
  Close,
  WarningAmber,
} from '@mui/icons-material';

const ORDER_STEPS = [
  { key: 'orderConfirm', label: 'Order Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'outForDelivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700' },
  active: { label: 'Active', bg: 'bg-blue-50', text: 'text-blue-700' },
  success: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  cancel: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700' },
  failed: { label: 'Failed', bg: 'bg-red-50', text: 'text-red-600' },
};

function getActiveStep(orderStatus) {
  if (!orderStatus) return -1;
  if (orderStatus.delivered?.isConfirmed) return 3;
  if (orderStatus.outForDelivery?.isConfirmed) return 2;
  if (orderStatus.shipped?.isConfirmed) return 1;
  if (orderStatus.orderConfirm?.isConfirmed) return 0;
  return -1;
}

const CANCELLABLE = ['pending', 'active'];

const OrderDetail = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const user = useSelector((state) => state.auth.user);
  const { singleOrder } = useSelector((state) => state.order);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([
        dispatch(getUser()),
        dispatch(getSingleOrder(params?.orderId)),
      ]);
      setLoading(false);
    };
    load();
  }, [dispatch, params?.orderId]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    const result = await dispatch(updateOrder({ status: 'cancel' }, order.id));
    if (result) {
      await dispatch(getSingleOrder(params?.orderId));
    }
    setCancelling(false);
    setCancelModal(false);
  };

  const order = singleOrder || {};
  const products = order.products || [];
  const canCancel = CANCELLABLE.includes(order.status);
  const address = order.address || {};
  const status = statusConfig[order.status] || statusConfig.pending;

  let mrpTotal = 0;
  let costTotal = 0;
  let itemCount = 0;
  for (const item of products) {
    mrpTotal += (item.productId?.price?.mrp || 0) * (item.qty || 1);
    costTotal += (item.productId?.price?.cost || 0) * (item.qty || 1);
    itemCount += (item.qty || 1);
  }
  const discount = mrpTotal - costTotal;

  if (loading) {
    return (
      <UserDashboardLayout title="Order Details">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-[3px] border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
        </div>
      </UserDashboardLayout>
    );
  }

  if (!order.id && !loading) {
    return (
      <UserDashboardLayout title="Order Details">
        <button
          onClick={() => router.push('/orders')}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors mb-5"
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          Back to Orders
        </button>
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag sx={{ fontSize: 24, color: '#d4d4d4' }} />
          </div>
          <p className="text-sm font-semibold text-neutral-800">Order not found</p>
          <p className="text-xs text-neutral-400 mt-1">This order may have been removed or the link is invalid.</p>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout
      title="Order Details"
      subtitle={`Order #${order.orderId || order.id?.slice(-8) || ''}`}
    >
      <button
        onClick={() => router.push('/orders')}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors mb-5"
      >
        <ArrowBack sx={{ fontSize: 16 }} />
        Back to Orders
      </button>

      <div className="space-y-4">
        {/* Order header card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-neutral-400">
                Order placed {order.createdAt
                  ? dayjs(order.createdAt).format('DD MMM YYYY, h:mm A')
                  : '-'}
              </p>
              <p className="text-sm font-semibold text-neutral-900 mt-0.5">
                Order #{order.orderId || order.id?.slice(-8)}
              </p>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
          {canCancel && (
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <p className="text-xs text-neutral-400">
                {order.status === 'pending' ? 'Your order is being processed' : 'Your order is on the way'}
              </p>
              <button
                onClick={() => setCancelModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Cancel sx={{ fontSize: 14 }} />
                Cancel Order
              </button>
            </div>
          )}
        </div>

        {/* Products list */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-2">
            <Inventory2 sx={{ fontSize: 16, color: '#a3a3a3' }} />
            <h3 className="text-sm font-semibold text-neutral-900">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
            </h3>
          </div>

          <div className="divide-y divide-neutral-100">
            {products.map((item, idx) => {
              const prod = item.productId;
              const activeStep = getActiveStep(item.orderStatus);

              return (
                <div key={idx} className="p-5">
                  <div className="flex gap-4">
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-neutral-100 overflow-hidden shrink-0 cursor-pointer"
                      onClick={() => prod?.id && router.push(`/product/${prod.id}`)}
                    >
                      {prod?.image ? (
                        <img src={prod.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag sx={{ fontSize: 22, color: '#d4d4d4' }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm sm:text-base font-semibold text-neutral-900 truncate cursor-pointer hover:text-neutral-600 transition-colors"
                        onClick={() => prod?.id && router.push(`/product/${prod.id}`)}
                      >
                        {prod?.title?.shortTitle || 'Product'}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">
                        {prod?.title?.longTitle}
                      </p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base font-bold text-neutral-900">
                          ₹{(prod?.price?.cost || 0).toLocaleString()}
                        </span>
                        {prod?.price?.mrp && prod.price.mrp !== prod.price.cost && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{prod.price.mrp.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">Qty: {item.qty || 1}</p>
                    </div>
                  </div>

                  {/* Order tracking for this product */}
                  <div className="mt-5 pt-4 border-t border-neutral-100">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                      Tracking
                    </p>
                    <div className="relative">
                      {ORDER_STEPS.map((step, i) => {
                        const isCompleted = i <= activeStep;
                        const isCurrent = i === activeStep;
                        const stepDate = item.orderStatus?.[step.key]?.date;

                        return (
                          <div key={step.key} className="flex gap-3.5 pb-5 last:pb-0 relative">
                            {i < ORDER_STEPS.length - 1 && (
                              <div
                                className={`absolute left-[9px] top-[24px] w-0.5 h-[calc(100%-12px)] ${
                                  isCompleted && i < activeStep ? 'bg-emerald-500' : 'bg-neutral-200'
                                }`}
                              />
                            )}
                            <div className="shrink-0 relative z-10">
                              {isCompleted ? (
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                    isCurrent ? 'bg-emerald-500 ring-[3px] ring-emerald-100' : 'bg-emerald-500'
                                  }`}
                                >
                                  <CheckCircle sx={{ fontSize: 13, color: 'white' }} />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-neutral-200 bg-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                                }`}
                              >
                                {step.label}
                              </p>
                              {stepDate && (
                                <p className="text-[11px] text-neutral-400 mt-0.5">
                                  {dayjs(stepDate).format('DD MMM YYYY, h:mm A')}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <LocalShipping sx={{ fontSize: 16, color: '#a3a3a3' }} />
              <h3 className="text-sm font-semibold text-neutral-900">Shipping Address</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-700">
                {user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '-'}
              </p>
              {address.locality && (
                <p className="text-xs text-neutral-500">{address.locality}</p>
              )}
              <p className="text-xs text-neutral-500">
                {[address.city, address.state].filter(Boolean).join(', ')}
              </p>
              {address.zipcode && (
                <p className="text-xs text-neutral-500">PIN: {address.zipcode}</p>
              )}
              {address.country && (
                <p className="text-xs text-neutral-400">{address.country}</p>
              )}
              {user?.phone && (
                <p className="text-xs text-neutral-500 mt-2">Phone: {user.phone}</p>
              )}
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Receipt sx={{ fontSize: 16, color: '#a3a3a3' }} />
              <h3 className="text-sm font-semibold text-neutral-900">Price Details</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-xs text-neutral-500">
                  Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
                <span className="text-xs font-medium text-neutral-700">
                  ₹{mrpTotal.toLocaleString()}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-500">Discount</span>
                  <span className="text-xs font-medium text-emerald-600">
                    - ₹{discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs text-neutral-500">Shipping</span>
                <span className="text-xs font-medium text-emerald-600">Free</span>
              </div>
              <div className="border-t border-dashed border-neutral-200 my-1" />
              <div className="flex justify-between">
                <span className="text-sm font-bold text-neutral-900">Total</span>
                <span className="text-sm font-bold text-neutral-900">
                  ₹{costTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment info */}
        {order.paymentId && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Payment</h3>
            <p className="text-xs text-neutral-500">
              Payment ID: {order.paymentId}
            </p>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !cancelling && setCancelModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-sm mx-4 p-6">
            <button
              onClick={() => !cancelling && setCancelModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100 text-neutral-400"
            >
              <Close sx={{ fontSize: 18 }} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <WarningAmber sx={{ fontSize: 28, color: '#ef4444' }} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Cancel this order?</h3>
              <p className="text-sm text-neutral-500 mt-1.5">
                Order #{order.orderId || order.id?.slice(-8)} will be cancelled. This action cannot be undone.
              </p>

              {products[0]?.productId && (
                <div className="w-full mt-4 p-3 bg-neutral-50 rounded-xl flex items-center gap-3 text-left">
                  {products[0].productId.image && (
                    <img
                      src={products[0].productId.image}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-neutral-200 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {products[0].productId.title?.shortTitle || 'Product'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {products.length} {products.length === 1 ? 'item' : 'items'}
                      {products[0].productId.price?.cost && (
                        <> · ₹{products[0].productId.price.cost.toLocaleString()}</>
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 w-full mt-6">
                <button
                  onClick={() => setCancelModal(false)}
                  disabled={cancelling}
                  className="flex-1 h-11 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 h-11 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Yes, Cancel'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserDashboardLayout>
  );
};

export default OrderDetail;
