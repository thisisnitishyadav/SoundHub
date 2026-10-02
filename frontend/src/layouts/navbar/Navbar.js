'use client'
import { Favorite, Person, ShoppingBag, Menu, Close } from '@mui/icons-material';
import { Box, InputAdornment, TextField, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '@/redux/slices/product';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.product);
  const [isVisible, setVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [collectionz, setCollectionz] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => setVisible(true);
  const handleMouseLeave = () => setVisible(false);

  const handleProductQuery = (value) => {
    setCollectionz(value);
    setMobileMenuOpen(false);
    router.push(`/collection/${value}`);
  };

  const handleCartQuery = () => router.push('/cart/products');

  const fetchProduct = async () => {
    let result = await dispatch(getProducts(1, 10, { 'category': collectionz }));
    if (result) return true;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      router.push(`/collection/${query}`);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [collectionz]);

  const categories = [
    { label: 'Wireless Earbuds', value: 'wireless-earphones', img: 'https://www.boat-lifestyle.com/cdn/shop/collections/dropdown-TWS_100x.png?v=1684827062' },
    { label: 'Neckbands', value: 'neckbands', img: 'https://www.boat-lifestyle.com/cdn/shop/collections/Neckbands_06214c1a-5e30-48ea-ac14-4a6bff679f48_100x.png?v=1684828287' },
    { label: 'Smart Watches', value: 'smart-watches', img: 'https://www.boat-lifestyle.com/cdn/shop/collections/smartwatches_100x.png?v=1684827668' },
    { label: 'Headphones', value: 'headphone', img: 'https://www.boat-lifestyle.com/cdn/shop/collections/Rectangle271_100x.png?v=1701414051' },
    { label: 'Wireless Speakers', value: 'wireless-speakers', img: 'https://www.boat-lifestyle.com/cdn/shop/collections/box-5_100x.png?v=1684827751' },
    { label: 'Party Speakers', value: 'party-speakers', img: 'https://www.boat-lifestyle.com/cdn/shop/collections/sound_bar_4f111a6a-2482-41c8-87f2-db7e0ee19e69_1_100x.webp?v=1684827961' },
  ];

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-white/0 backdrop-blur-sm'}`}>
      <div className="flex mx-4 md:mx-8 lg:mx-12 h-[60px] md:h-[70px] items-center justify-between max-w-7xl xl:mx-auto">

        <div className="flex items-center gap-3">
          <div className="md:hidden cursor-pointer p-1.5 rounded-lg hover:bg-black/5 transition-colors" onClick={() => setMobileMenuOpen(true)}>
            <Menu sx={{ fontSize: 22, color: scrolled ? '#374151' : '#374151' }} />
          </div>
          <img
            src="https://soundhub.io/wp-content/uploads/2023/08/SoundHub-Logo-2048x410.png"
            alt="SoundHub"
            className="h-[26px] md:h-[32px] cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>

        <div className="md:flex md:items-center gap-1 hidden">
          <div className="cursor-pointer relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <p className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">Categories</p>
            {isVisible && (
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xl shadow-black/10 absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 min-w-[460px]">
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((cat) => (
                    <div key={cat.value} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleProductQuery(cat.value)}>
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <img src={cat.img} alt={cat.label} className="w-7 h-7 object-contain" />
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{cat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {['Hub Personalisation', 'Gift with Hub', 'Corporates Order'].map((item) => (
            <div key={item} className="cursor-pointer">
              <p className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">{item}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="md:flex hidden">
            <form onSubmit={handleSearch}>
              <Box sx={{ maxWidth: 220 }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton type="submit" aria-label="search" size="small">
                          <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      '& fieldset': { borderRadius: '12px', borderColor: '#e5e7eb' },
                      '&:hover fieldset': { borderColor: '#d1d5db !important' },
                      fontSize: '13px',
                      backgroundColor: '#f9fafb',
                      height: '38px',
                    },
                  }}
                />
              </Box>
            </form>
          </div>

          <div className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => router.push('/login')}>
            <Person sx={{ fontSize: 20, color: '#374151' }} />
          </div>
          <div className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <Favorite sx={{ fontSize: 20, color: '#374151' }} />
          </div>
          <div className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors relative" onClick={() => handleCartQuery()}>
            <ShoppingBag sx={{ fontSize: 20, color: '#374151' }} />
          </div>
        </div>
      </div>

      <div className="bg-white/95 mx-4 md:mx-8 pb-3 md:hidden">
        <form onSubmit={handleSearch}>
          <Box>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton type="submit" aria-label="search" size="small">
                      <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  '& fieldset': { borderRadius: '12px', borderColor: '#e5e7eb' },
                  fontSize: '13px',
                  backgroundColor: '#f9fafb',
                  height: '38px',
                },
              }}
            />
          </Box>
        </form>
      </div>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { borderTopRightRadius: '20px', borderBottomRightRadius: '20px', width: 300 } }}
      >
        <Box sx={{ width: 300 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5 }}>
            <img src="https://soundhub.io/wp-content/uploads/2023/08/SoundHub-Logo-2048x410.png" alt="logo" style={{ height: 26 }} />
            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ '&:hover': { backgroundColor: '#f3f4f6' } }}>
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ px: 1, pt: 1 }}>
            <ListItem>
              <ListItemText primary="Categories" primaryTypographyProps={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.1em' }} />
            </ListItem>
            {categories.map((cat) => (
              <ListItem
                key={cat.value}
                onClick={() => handleProductQuery(cat.value)}
                sx={{ cursor: 'pointer', pl: 2, borderRadius: '12px', mx: 0.5, mb: 0.5, '&:hover': { backgroundColor: '#f9fafb' } }}
              >
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center mr-3 flex-shrink-0">
                  <img src={cat.img} alt={cat.label} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                </div>
                <ListItemText primary={cat.label} primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mx: 2 }} />
          <List sx={{ px: 1 }}>
            {['Hub Personalisation', 'Gift with Hub', 'Corporates Order'].map((item) => (
              <ListItem key={item} sx={{ cursor: 'pointer', borderRadius: '12px', mx: 0.5, mb: 0.5, '&:hover': { backgroundColor: '#f9fafb' } }}>
                <ListItemText primary={item} primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default Navbar;
