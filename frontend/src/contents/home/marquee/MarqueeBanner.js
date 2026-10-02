'use client';
import React from 'react';

const items = [
  'FREE SHIPPING ON ₹499+',
  'EASY 7-DAY RETURNS',
  '1 YEAR WARRANTY',
  'COD AVAILABLE',
  'NEW ARRIVALS WEEKLY',
  'FREE SHIPPING ON ₹499+',
  'EASY 7-DAY RETURNS',
  '1 YEAR WARRANTY',
  'COD AVAILABLE',
  'NEW ARRIVALS WEEKLY',
];

const MarqueeBanner = () => {
  return (
    <div className="bg-[#0a0a0a] py-3 overflow-hidden border-b border-white/5">
      <div className="marquee-container">
        <div className="marquee-content">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 mx-8">
              <span className="text-[11px] text-white/50 uppercase tracking-[0.2em] font-medium whitespace-nowrap">{item}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeBanner;
