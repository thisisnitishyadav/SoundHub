'use client'
import {
  Person,
  ShoppingBag,
  Menu,
  Close,
  Search,
  KeyboardArrowDown,
  FavoriteBorder,
  LocalShipping,
  Percent,
} from '@mui/icons-material';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { carts } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const megaMenuTimeout = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleMegaMenuEnter = () => {
    clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 200);
  };

  const handleProductQuery = (value) => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    router.push(`/collection/${value}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/collection/${query}`);
      setQuery('');
      setMobileSearchOpen(false);
    }
  };

  const isLoggedIn = user && Object.keys(user).length > 0;
  const cartCount = carts?.length || 0;

  const categories = [
    {
      label: 'Wireless Earbuds',
      value: 'wireless-earphones',
      img: 'https://www.boat-lifestyle.com/cdn/shop/collections/dropdown-TWS_100x.png?v=1684827062',
      desc: 'True wireless freedom',
    },
    {
      label: 'Neckbands',
      value: 'neckbands',
      img: 'https://www.boat-lifestyle.com/cdn/shop/collections/Neckbands_06214c1a-5e30-48ea-ac14-4a6bff679f48_100x.png?v=1684828287',
      desc: 'All-day comfort',
    },
    {
      label: 'Smart Watches',
      value: 'smart-watches',
      img: 'https://www.boat-lifestyle.com/cdn/shop/collections/smartwatches_100x.png?v=1684827668',
      desc: 'Stay connected',
    },
    {
      label: 'Headphones',
      value: 'headphone',
      img: 'https://www.boat-lifestyle.com/cdn/shop/collections/Rectangle271_100x.png?v=1701414051',
      desc: 'Immersive sound',
    },
    {
      label: 'Wireless Speakers',
      value: 'wireless-speakers',
      img: 'https://www.boat-lifestyle.com/cdn/shop/collections/box-5_100x.png?v=1684827751',
      desc: 'Room-filling audio',
    },
    {
      label: 'Party Speakers',
      value: 'party-speakers',
      img: 'https://www.boat-lifestyle.com/cdn/shop/collections/sound_bar_4f111a6a-2482-41c8-87f2-db7e0ee19e69_1_100x.webp?v=1684827961',
      desc: 'Turn it up',
    },
  ];

  const navLinks = [
    { label: 'New Arrivals', href: '/collection/new-arrivals' },
    { label: 'Best Sellers', href: '/collection/best-sellers' },
    { label: 'Offers', href: '/collection/offers' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-neutral-900 text-white text-center text-[11px] sm:text-xs tracking-wide py-2 px-4 select-none">
        <div className="flex items-center justify-center gap-2">
          <LocalShipping sx={{ fontSize: 14 }} />
          <span>Free shipping on orders above &#8377;999</span>
          <span className="hidden sm:inline mx-2 opacity-30">|</span>
          <span className="hidden sm:flex items-center gap-1">
            <Percent sx={{ fontSize: 13 }} />
            Use code <strong className="font-semibold">SOUND10</strong> for 10% off
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-neutral-100'
            : 'bg-white border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="lg:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu sx={{ fontSize: 22 }} />
              </button>

              <img
                src="https://soundhub.io/wp-content/uploads/2023/08/SoundHub-Logo-2048x410.png"
                alt="SoundHub"
                className="h-7 sm:h-8 cursor-pointer shrink-0"
                onClick={() => router.push('/')}
              />
            </div>

            {/* Center: Nav Links + Categories */}
            <div className="hidden lg:flex items-center gap-1 ml-10">
              {/* Categories Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
              >
                <button
                  className={`flex items-center gap-0.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    megaMenuOpen
                      ? 'text-neutral-900 bg-neutral-100'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Categories
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 18,
                      transition: 'transform 0.2s',
                      transform: megaMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                    }}
                  />
                </button>

                {/* Mega Menu */}
                <div
                  className={`absolute top-full left-0 mt-1 transition-all duration-200 origin-top-left ${
                    megaMenuOpen
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-xl shadow-black/8 border border-neutral-100 p-5 w-[520px]">
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => handleProductQuery(cat.value)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left group"
                        >
                          <div className="w-11 h-11 rounded-xl bg-neutral-50 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center shrink-0 transition-all">
                            <img
                              src={cat.img}
                              alt={cat.label}
                              className="w-7 h-7 object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-800 group-hover:text-neutral-950">
                              {cat.label}
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              {cat.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <button
                        onClick={() => handleProductQuery('all')}
                        className="text-sm font-medium text-neutral-900 hover:text-black flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        View all categories
                        <span className="text-xs">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => router.push(link.href)}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-1">
              {/* Desktop Search */}
              <form
                onSubmit={handleSearch}
                className="hidden md:flex items-center relative"
              >
                <div className="relative">
                  <Search
                    sx={{ fontSize: 18 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-52 h-9 pl-9 pr-3 text-sm bg-neutral-100/80 border border-transparent rounded-xl outline-none transition-all placeholder:text-neutral-400 text-neutral-700 focus:w-64 focus:bg-white focus:border-neutral-200 focus:shadow-sm"
                  />
                </div>
              </form>

              {/* Mobile Search Toggle */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Search"
              >
                <Search sx={{ fontSize: 20, color: '#525252' }} />
              </button>

              {/* Account */}
              <button
                className="p-2 rounded-xl hover:bg-neutral-100 transition-colors relative group"
                onClick={() =>
                  router.push(isLoggedIn ? '/myAccount' : '/login')
                }
                aria-label="Account"
              >
                <Person sx={{ fontSize: 20, color: '#525252' }} />
                {isLoggedIn && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Wishlist */}
              <button
                className="hidden sm:flex p-2 rounded-xl hover:bg-neutral-100 transition-colors"
                aria-label="Wishlist"
              >
                <FavoriteBorder sx={{ fontSize: 20, color: '#525252' }} />
              </button>

              {/* Cart */}
              <button
                className="p-2 rounded-xl hover:bg-neutral-100 transition-colors relative"
                onClick={() => router.push('/cart/products')}
                aria-label="Cart"
              >
                <ShoppingBag sx={{ fontSize: 20, color: '#525252' }} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-neutral-900 text-white text-[10px] font-bold rounded-full px-1 ring-2 ring-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (expandable) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <form
            onSubmit={handleSearch}
            className="px-4 pb-3"
          >
            <div className="relative">
              <Search
                sx={{ fontSize: 18 }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-9 pr-4 text-sm bg-neutral-100 rounded-xl outline-none placeholder:text-neutral-400 text-neutral-700 focus:bg-white focus:ring-2 focus:ring-neutral-200 transition-all"
              />
            </div>
          </form>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-100">
            <img
              src="https://soundhub.io/wp-content/uploads/2023/08/SoundHub-Logo-2048x410.png"
              alt="SoundHub"
              className="h-6"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Close menu"
            >
              <Close sx={{ fontSize: 20 }} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="overflow-y-auto h-[calc(100%-65px)]">
            {/* Categories */}
            <div className="p-4">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-3 px-1">
                Shop by Category
              </p>
              <div className="space-y-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleProductQuery(cat.value)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                      <img
                        src={cat.img}
                        alt={cat.label}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">
                        {cat.label}
                      </p>
                      <p className="text-[11px] text-neutral-400">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-4 border-t border-neutral-100" />

            {/* Nav Links */}
            <div className="p-4">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-3 px-1">
                Explore
              </p>
              <div className="space-y-0.5">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(link.href);
                    }}
                    className="w-full text-left text-sm font-medium text-neutral-700 hover:text-neutral-900 p-2.5 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-4 border-t border-neutral-100" />

            {/* Account Section */}
            <div className="p-4 space-y-0.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push(isLoggedIn ? '/myAccount' : '/login');
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center">
                  <Person sx={{ fontSize: 20, color: '#525252' }} />
                </div>
                <p className="text-sm font-medium text-neutral-700">
                  {isLoggedIn ? 'My Account' : 'Sign In'}
                </p>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/orders');
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center">
                  <LocalShipping sx={{ fontSize: 20, color: '#525252' }} />
                </div>
                <p className="text-sm font-medium text-neutral-700">
                  My Orders
                </p>
              </button>

              <button
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center">
                  <FavoriteBorder sx={{ fontSize: 20, color: '#525252' }} />
                </div>
                <p className="text-sm font-medium text-neutral-700">
                  Wishlist
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
