'use client'
import React from 'react'
import { Facebook, Instagram, LinkedIn, X, YouTube } from '@mui/icons-material';

function Footer() {
  return (
    <>
      <div className="bg-[#0a0a0a] text-gray-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-6 md:px-12 py-14 gap-10">
          <div className="space-y-5">
            <img
              src="https://soundhub.io/wp-content/uploads/2023/08/SoundHub-Logo-2048x410.png"
              alt="SoundHub"
              className="w-36 md:w-40 brightness-0 invert"
            />
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium audio & wearable tech. Engineered for your lifestyle.
            </p>
            <div className="flex gap-3 pt-1">
              {[
                { Icon: Facebook, url: '#' },
                { Icon: X, url: '#' },
                { Icon: Instagram, url: '#' },
                { Icon: YouTube, url: 'https://www.youtube.com/@nitishyadav0507' },
                { Icon: LinkedIn, url: 'https://www.linkedin.com/in/nitish-yadav-68073720b/' },
              ].map(({ Icon, url }, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => url !== '#' && window.open(url, '_blank')}
                >
                  <Icon sx={{ fontSize: 16, color: '#9ca3af' }} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Shop</p>
            <ul className="space-y-3">
              {['True Wireless Earbuds', 'Wired Headphones', 'Home Audio', 'Smart Watches', 'Wireless Headphones', 'Wireless Speakers'].map((item) => (
                <li key={item} className="text-sm text-gray-500 hover:text-white cursor-pointer transition-colors">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Help</p>
            <ul className="space-y-3">
              {['Track Your Order', 'Warranty & Support', 'Return Policy', 'Service Centers', 'Bulk Orders', 'FAQs'].map((item) => (
                <li key={item} className="text-sm text-gray-500 hover:text-white cursor-pointer transition-colors">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Company</p>
            <ul className="space-y-3">
              {['About SoundHub', 'News', 'Blog', 'Careers', 'Security', 'Investor Relations'].map((item) => (
                <li key={item} className="text-sm text-gray-500 hover:text-white cursor-pointer transition-colors">{item}</li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-3">Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-l-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                />
                <button className="bg-white text-gray-900 px-4 py-2 rounded-r-lg text-xs font-semibold hover:bg-gray-100 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#050505] text-gray-600 px-6 md:px-12 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs">&copy; 2024 TechPyro Marketing Limited. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <p className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</p>
            <span className="text-gray-700">|</span>
            <p className="hover:text-gray-400 cursor-pointer transition-colors">Terms & Conditions</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer;
