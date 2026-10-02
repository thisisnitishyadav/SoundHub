'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const PromoBanner = () => {
  const router = useRouter();

  return (
    <section className="px-6 md:px-12 py-8 md:py-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div
          className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer min-h-[280px] md:min-h-[360px]"
          onClick={() => router.push('/collection/wireless-earphones')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e]" />
          <div className="absolute top-0 right-0 w-3/4 h-full opacity-10">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <circle cx="300" cy="200" r="250" fill="none" stroke="white" strokeWidth="0.5"/>
              <circle cx="300" cy="200" r="180" fill="none" stroke="white" strokeWidth="0.5"/>
              <circle cx="300" cy="200" r="110" fill="none" stroke="white" strokeWidth="0.5"/>
            </svg>
          </div>
          <div className="relative z-10 p-8 md:p-10 flex flex-col justify-between h-full">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] text-xs font-semibold uppercase tracking-wider mb-4">
                Limited Time
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Up to 70%<br/>Off Earbuds
              </h3>
              <p className="text-white/50 mt-3 text-sm md:text-base max-w-xs">
                Premium sound doesn&apos;t have to break the bank. Grab your pair before they&apos;re gone.
              </p>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:gap-3 transition-all">
                Shop the sale
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4 md:gap-6">
          <div
            className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
            onClick={() => router.push('/collection/smart-watches')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd740]/20 to-[#ff9100]/20" />
            <div className="absolute inset-0 bg-[#fffbf0]" />
            <div className="relative z-10 p-6 md:p-8 flex items-center justify-between h-full">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-amber-600/60 font-medium mb-2">New Collection</p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Smart Watches</h3>
                <p className="text-sm text-gray-500 mt-1">Starting ₹999</p>
                <span className="inline-flex items-center gap-1 text-gray-900 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                  Explore
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <img
                src="https://www.boat-lifestyle.com/cdn/shop/files/img_2_mob_390x.png?v=1686117497"
                alt="Smart Watch"
                className="h-28 md:h-36 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
              />
            </div>
          </div>

          <div
            className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
            onClick={() => router.push('/collection/headphone')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9]" />
            <div className="relative z-10 p-6 md:p-8 flex items-center justify-between h-full">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-600/60 font-medium mb-2">Premium Audio</p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Headphones</h3>
                <p className="text-sm text-gray-500 mt-1">Active Noise Cancellation</p>
                <span className="inline-flex items-center gap-1 text-gray-900 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                  Explore
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <img
                src="https://www.boat-lifestyle.com/cdn/shop/files/img_4_mob_1560x.png?v=1686131733"
                alt="Headphones"
                className="h-28 md:h-36 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
