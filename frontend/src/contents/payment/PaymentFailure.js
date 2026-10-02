'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  ErrorOutline,
  Refresh,
  ArrowForward,
  HeadsetMic,
} from '@mui/icons-material';

const PaymentFailure = () => {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-red-50/50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Animated icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse opacity-40" />
          <div className="relative w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ErrorOutline sx={{ fontSize: 52, color: '#dc2626' }} />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Payment Failed
        </h1>
        <p className="text-neutral-500 mt-3 leading-relaxed">
          We couldn't process your payment. Don't worry — no money has been deducted from your account.
        </p>

        {/* Common issues */}
        <div className="bg-white rounded-xl border border-neutral-100 p-4 mt-8 text-left">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Common reasons</p>
          <ul className="space-y-2">
            {[
              'Insufficient funds in your account',
              'Card details entered incorrectly',
              'Your bank declined the transaction',
              'Network timeout — try again',
            ].map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => router.push('/cart/products')}
            className="w-full h-12 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <Refresh sx={{ fontSize: 18 }} />
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full h-12 bg-neutral-100 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-xs text-neutral-400 mt-6 flex items-center justify-center gap-1">
          <HeadsetMic sx={{ fontSize: 14 }} />
          Still having issues? <span className="text-neutral-700 font-medium cursor-pointer hover:underline">Contact Support</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailure;
