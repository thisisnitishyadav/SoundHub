'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  CheckCircle,
  ArrowForward,
  LocalShipping,
  Receipt,
} from '@mui/icons-material';

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-emerald-50/50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Animated check */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
          <div className="relative w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle sx={{ fontSize: 52, color: '#16a34a' }} />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-neutral-500 mt-3 leading-relaxed">
          Your order has been confirmed and is being processed. You'll receive a confirmation email shortly.
        </p>

        {/* Order info cards */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <div className="bg-white rounded-xl border border-neutral-100 p-4 text-left">
            <LocalShipping sx={{ fontSize: 20, color: '#525252' }} />
            <p className="text-xs text-neutral-400 mt-2">Estimated Delivery</p>
            <p className="text-sm font-semibold text-neutral-800 mt-0.5">3-5 Business Days</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 p-4 text-left">
            <Receipt sx={{ fontSize: 20, color: '#525252' }} />
            <p className="text-xs text-neutral-400 mt-2">Payment Method</p>
            <p className="text-sm font-semibold text-neutral-800 mt-0.5">Online Payment</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => router.push('/orders')}
            className="w-full h-12 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            View My Orders
            <ArrowForward sx={{ fontSize: 16 }} />
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full h-12 bg-neutral-100 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-xs text-neutral-400 mt-6">
          Need help? <span className="text-neutral-700 font-medium cursor-pointer hover:underline">Contact Support</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
