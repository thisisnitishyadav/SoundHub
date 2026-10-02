'use client';
import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="bg-[#0a0a0a] mx-6 md:mx-12 rounded-2xl md:rounded-3xl my-12 md:my-16">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="relative z-10 px-8 md:px-16 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Stay in the loop</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-lg mx-auto">
            Get <span className="text-[#00e5ff]">10% off</span> your first order
          </h2>

          <p className="text-white/40 mt-4 text-sm md:text-base max-w-md mx-auto">
            Subscribe to our newsletter for exclusive deals, new product launches, and insider-only content.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-300 whitespace-nowrap"
            >
              {submitted ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>

          <p className="text-white/20 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
