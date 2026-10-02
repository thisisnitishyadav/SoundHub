'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowForward } from '@mui/icons-material';

const slides = [
  {
    title: 'Immersive Sound',
    subtitle: 'Experience',
    description: 'Premium wireless earbuds engineered for audiophiles. Crystal-clear highs, thundering bass, and 60-hour battery life.',
    cta: 'Shop Earbuds',
    link: '/collection/wireless-earphones',
    image: 'https://www.boat-lifestyle.com/cdn/shop/files/img_1_desktop_4c81b094-8292-4d54-8b20-5eb3b823a4e6_2800x.png?v=1686650857',
    accent: '#00e5ff',
  },
  {
    title: 'Smart on Your',
    subtitle: 'Wrist',
    description: 'Track fitness, take calls, and stay connected with our next-gen smartwatches. Starting at just ₹999.',
    cta: 'Shop Watches',
    link: '/collection/smart-watches',
    image: 'https://www.boat-lifestyle.com/cdn/shop/files/img_2_mob_390x.png?v=1686117497',
    accent: '#ffd740',
  },
  {
    title: 'Sound That',
    subtitle: 'Moves You',
    description: 'Portable wireless speakers built for adventure. Waterproof, shockproof, and ridiculously loud.',
    cta: 'Shop Speakers',
    link: '/collection/wireless-speakers',
    image: 'https://www.boat-lifestyle.com/cdn/shop/files/Stone750_FI-Blue01_600x.png?v=1699266341',
    accent: '#7c4dff',
  },
];

const HeroBanner = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative bg-[#0a0a0a] overflow-hidden min-h-[85vh] flex items-center">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${slide.accent}40 0%, transparent 70%)`,
          transition: 'background 1s ease',
        }}
      />

      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className={`space-y-6 md:space-y-8 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: slide.accent }} />
              <span className="text-xs text-white/60 uppercase tracking-widest font-medium">New Arrivals</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight">
              {slide.title}
              <br />
              <span style={{ color: slide.accent }}>{slide.subtitle}</span>
            </h1>

            <p className="text-base md:text-lg text-white/50 max-w-md leading-relaxed">
              {slide.description}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => router.push(slide.link)}
                className="group flex items-center gap-3 bg-white text-black px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
              >
                {slide.cta}
                <ArrowForward sx={{ fontSize: 18 }} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => router.push('/collection/wireless-earphones')}
                className="flex items-center gap-2 text-white/60 text-sm font-medium hover:text-white transition-colors px-4 py-3.5"
              >
                Explore All
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-white">50K+</p>
                <p className="text-xs text-white/40 mt-0.5">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl md:text-3xl font-bold text-white">4.8</p>
                <p className="text-xs text-white/40 mt-0.5">Average Rating</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl md:text-3xl font-bold text-white">200+</p>
                <p className="text-xs text-white/40 mt-0.5">Products</p>
              </div>
            </div>
          </div>

          <div className={`flex justify-center lg:justify-end transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="relative">
              <div
                className="absolute inset-0 blur-[100px] opacity-30 rounded-full"
                style={{ backgroundColor: slide.accent }}
              />
              <img
                src={slide.image}
                alt={slide.title}
                className="relative z-10 max-h-[500px] w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-12 lg:mt-16">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrent(i);
                  setIsTransitioning(false);
                }, 300);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? 'w-10 bg-white' : 'w-6 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
