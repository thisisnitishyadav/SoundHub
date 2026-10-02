'use client'
import React, { useEffect, useState } from "react";
import { deleteCart, readCart } from '@/redux/slices/cart';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from '@/redux/store/store';
import { Close, LocalShipping, ShieldOutlined, ArrowForward, ShoppingBagOutlined } from '@mui/icons-material';

const Cart1 = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { carts } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({ 'isDeleted': false, 'userId': user?.user?.id });

  const fetchCart = async () => {
    try {
      await dispatch(readCart(page, limit, filters));
      return true;
    } catch (error) {
      console.error('Error', error);
      return false;
    }
  };

  const handleDelete = async (cartId) => {
    await dispatch(deleteCart(cartId));
  };

  const handleCreateOrder = async () => {
    router.push(`/checkout/${carts?.id}`);
  };

  useEffect(() => {
    fetchCart();
  }, [page, filters]);

  let total = 0;
  let itemCount = 0;
  for (let cart of carts) {
    for (let product of cart.products) {
      total += (product.productId?.price?.cost || 0);
      itemCount++;
    }
  }

  const isEmpty = !carts || carts.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
            <ShoppingBagOutlined sx={{ fontSize: 32, color: '#d1d5db' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Your cart is empty</h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            Looks like you haven&apos;t added anything yet. Explore our collection and find something you love.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 inline-flex items-center gap-2 bg-[#0a0a0a] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-300"
          >
            Start Shopping
            <ArrowForward sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-gray-400 mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {carts.map((item, index) => (
              <div key={index} className="group bg-white rounded-2xl border border-gray-100 p-4 md:p-5 hover:shadow-md transition-all duration-300">
                <div className="flex gap-4 md:gap-5">
                  <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-50">
                    <img
                      src={item.products[0].productId.image}
                      alt=""
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                      onClick={() => router.push(`/product/${item.products[0].productId?.id}`)}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className="text-sm md:text-base font-semibold text-gray-900 truncate cursor-pointer hover:text-gray-600 transition-colors"
                          onClick={() => router.push(`/product/${item.products[0].productId?.id}`)}
                        >
                          {item?.products[0]?.productId?.title?.shortTitle}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item?.products[0]?.productId?.title?.longTitle}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item?.id)}
                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Close sx={{ fontSize: 16 }} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-sm">-</button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200">1</span>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-sm">+</button>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-base md:text-lg font-bold text-gray-900">
                        ₹{item?.products[0]?.productId?.price?.cost?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{item?.products[0]?.productId?.price?.mrp?.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600">20% off</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-gray-900">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-emerald-600">{total >= 499 ? 'Free' : '₹49'}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-3" />
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">₹{(total >= 499 ? total : total + 49).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                className="w-full mt-6 h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowForward sx={{ fontSize: 16 }} />
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full mt-3 h-10 text-gray-500 text-xs font-medium hover:text-gray-900 transition-colors"
              >
                Continue Shopping
              </button>

              <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3">
                  <LocalShipping sx={{ fontSize: 16, color: '#9ca3af' }} />
                  <span className="text-xs text-gray-400">Free shipping on orders above ₹499</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldOutlined sx={{ fontSize: 16, color: '#9ca3af' }} />
                  <span className="text-xs text-gray-400">Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart1;
