'use client';
import AdminShell from '../AdminShell';
import { useEffect, useState, useCallback } from 'react';
import { adminProducts, adminUpload } from '@/lib/adminApi';
import {
  getFeaturedProducts,
  setFeaturedProducts,
  getTrendingProducts,
  setTrendingProducts,
  dbProductToFeatured,
  dbProductToTrending,
} from '@/lib/featuredConfig';
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  Close,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Star,
  TrendingUp,
  Inventory2,
  OpenInNew,
  DragIndicator,
  AddCircleOutline,
} from '@mui/icons-material';

const CATEGORIES = [
  'wireless-earphones',
  'neckbands',
  'smart-watches',
  'headphone',
  'wireless-speakers',
  'party-speakers',
];

const BADGE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'Best Seller', label: 'Best Seller', color: '#0a0a0a' },
  { value: 'New', label: 'New', color: '#00e5ff' },
  { value: 'Trending', label: 'Trending', color: '#7c4dff' },
  { value: 'Premium', label: 'Premium', color: '#ffd740' },
  { value: 'Sale', label: 'Sale', color: '#ff5252' },
  { value: 'Popular', label: 'Popular', color: '#00e676' },
];

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [paginator, setPaginator] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    shortTitle: '', longTitle: '', category: '', mrp: '', discount: '', cost: '', tagLine: '', image: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Featured & Trending state
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [addPickerOpen, setAddPickerOpen] = useState(null); // 'featured' | 'trending' | null
  const [pickerProducts, setPickerProducts] = useState([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerLoading, setPickerLoading] = useState(false);

  // Edit featured/trending item
  const [editCuratedModal, setEditCuratedModal] = useState(null); // { type, index, item }

  useEffect(() => {
    setFeatured(getFeaturedProducts());
    setTrending(getTrendingProducts());
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = search
        ? { $or: [{ 'title.shortTitle': { $regex: search, $options: 'i' } }, { 'title.longTitle': { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }] }
        : {};
      const res = await adminProducts.list(page, 10, query);
      if (res.data?.data) {
        setProducts(res.data.data.data || []);
        setPaginator(res.data.data.paginator || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Product picker for adding to featured/trending
  const openPicker = async (type) => {
    setAddPickerOpen(type);
    setPickerSearch('');
    setPickerLoading(true);
    try {
      const res = await adminProducts.list(1, 20, {});
      setPickerProducts(res.data?.data?.data || []);
    } catch { }
    setPickerLoading(false);
  };

  const searchPicker = async (q) => {
    setPickerSearch(q);
    setPickerLoading(true);
    try {
      const query = q ? { $or: [{ 'title.shortTitle': { $regex: q, $options: 'i' } }, { category: { $regex: q, $options: 'i' } }] } : {};
      const res = await adminProducts.list(1, 20, query);
      setPickerProducts(res.data?.data?.data || []);
    } catch { }
    setPickerLoading(false);
  };

  const addToCurated = (type, dbProduct) => {
    if (type === 'featured') {
      if (featured.some((f) => f.id === dbProduct.id)) return;
      const updated = [...featured, dbProductToFeatured(dbProduct)];
      setFeatured(updated);
      setFeaturedProducts(updated);
    } else {
      if (trending.some((t) => t.id === dbProduct.id)) return;
      const updated = [...trending, dbProductToTrending(dbProduct)];
      setTrending(updated);
      setTrendingProducts(updated);
    }
    setAddPickerOpen(null);
  };

  const removeFromCurated = (type, id) => {
    if (type === 'featured') {
      const updated = featured.filter((f) => f.id !== id);
      setFeatured(updated);
      setFeaturedProducts(updated);
    } else {
      const updated = trending.filter((t) => t.id !== id);
      setTrending(updated);
      setTrendingProducts(updated);
    }
  };

  const saveCuratedEdit = () => {
    if (!editCuratedModal) return;
    const { type, index, item } = editCuratedModal;
    if (type === 'featured') {
      const updated = [...featured];
      updated[index] = item;
      setFeatured(updated);
      setFeaturedProducts(updated);
    } else {
      const updated = [...trending];
      updated[index] = item;
      setTrending(updated);
      setTrendingProducts(updated);
    }
    setEditCuratedModal(null);
  };

  // All Products CRUD
  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await adminProducts.softDelete(id); fetchProducts(); } catch { alert('Failed to delete'); }
    setMenuOpen(null);
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm({ shortTitle: '', longTitle: '', category: '', mrp: '', discount: '', cost: '', tagLine: '', image: '' });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ shortTitle: p.title?.shortTitle || '', longTitle: p.title?.longTitle || '', category: p.category || '', mrp: p.price?.mrp || '', discount: p.price?.discount || '', cost: p.price?.cost || '', tagLine: p.tagLine || '', image: p.image || '' });
    setModalOpen(true);
    setMenuOpen(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('files', file);
      fd.append('folderName', 'products');
      const res = await adminUpload.upload(fd);
      const url = res.data?.data?.uploadSuccess?.[0]?.path;
      if (url) setForm((f) => ({ ...f, image: url }));
    } catch { alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = { title: { shortTitle: form.shortTitle, longTitle: form.longTitle }, category: form.category, price: { mrp: Number(form.mrp), discount: form.discount, cost: Number(form.cost) }, tagLine: form.tagLine, image: form.image };
    try {
      if (editProduct) await adminProducts.update(editProduct.id, body);
      else await adminProducts.create(body);
      setModalOpen(false);
      fetchProducts();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { key: 'all', label: 'All Products', icon: Inventory2 },
    { key: 'featured', label: 'Featured', icon: Star },
    { key: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Manage products, featured, and trending sections
            </p>
          </div>
          {activeTab === 'all' && (
            <button onClick={openCreate} className="inline-flex items-center gap-2 h-9 px-4 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors">
              <Add sx={{ fontSize: 18 }} /> Add Product
            </button>
          )}
          {(activeTab === 'featured' || activeTab === 'trending') && (
            <button onClick={() => openPicker(activeTab)} className="inline-flex items-center gap-2 h-9 px-4 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors">
              <AddCircleOutline sx={{ fontSize: 18 }} /> Add from Products
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-neutral-100 rounded-xl p-1 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Icon sx={{ fontSize: 18 }} />
                {tab.label}
                {tab.key === 'featured' && <span className="ml-1 text-[10px] bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded-full">{featured.length}</span>}
                {tab.key === 'trending' && <span className="ml-1 text-[10px] bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded-full">{trending.length}</span>}
              </button>
            );
          })}
        </div>

        {/* All Products Tab */}
        {activeTab === 'all' && (
          <>
            <div className="relative mb-5">
              <Search sx={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="w-full sm:w-80 h-10 pl-9 pr-4 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 transition-colors" />
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-sm text-neutral-400">Loading...</div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center text-sm text-neutral-400">No products found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 text-xs">
                        <th className="text-left font-medium px-5 py-3">Product</th>
                        <th className="text-left font-medium px-5 py-3">Category</th>
                        <th className="text-left font-medium px-5 py-3">MRP</th>
                        <th className="text-left font-medium px-5 py-3">Price</th>
                        <th className="text-left font-medium px-5 py-3">Discount</th>
                        <th className="text-left font-medium px-5 py-3">Status</th>
                        <th className="text-right font-medium px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {p.image ? <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-100" /> : <div className="w-10 h-10 rounded-lg bg-neutral-100" />}
                              <a href={`/product/${p.id}`} target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-800 truncate max-w-[200px] hover:text-blue-600 hover:underline transition-colors">
                                {p.title?.shortTitle || p.title?.longTitle || '-'}
                              </a>
                            </div>
                          </td>
                          <td className="px-5 py-3"><span className="inline-block px-2 py-0.5 rounded-md bg-neutral-100 text-xs font-medium text-neutral-600 capitalize">{p.category?.replace(/-/g, ' ') || '-'}</span></td>
                          <td className="px-5 py-3 text-neutral-500 line-through">{p.price?.mrp ? `₹${p.price.mrp}` : '-'}</td>
                          <td className="px-5 py-3 font-medium text-neutral-800">{p.price?.cost ? `₹${p.price.cost}` : '-'}</td>
                          <td className="px-5 py-3 text-emerald-600 font-medium">{p.price?.discount || '-'}</td>
                          <td className="px-5 py-3"><span className={`inline-block w-2 h-2 rounded-full ${p.isActive ? 'bg-emerald-500' : 'bg-neutral-300'}`} /></td>
                          <td className="px-5 py-3 text-right relative">
                            <button onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)} className="p-1 rounded-lg hover:bg-neutral-100">
                              <MoreVert sx={{ fontSize: 18, color: '#737373' }} />
                            </button>
                            {menuOpen === p.id && (
                              <div className="absolute right-5 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-20 w-44">
                                <button onClick={() => openEdit(p)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"><Edit sx={{ fontSize: 16 }} /> Edit</button>
                                <a href={`/product/${p.id}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"><OpenInNew sx={{ fontSize: 16 }} /> View on Site</a>
                                <button onClick={() => handleDelete(p.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Delete sx={{ fontSize: 16 }} /> Delete</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {paginator.pageCount > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 text-sm">
                  <span className="text-neutral-500">Page {paginator.currentPage} of {paginator.pageCount}</span>
                  <div className="flex gap-1">
                    <button disabled={!paginator.prev} onClick={() => setPage(page - 1)} className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30"><ChevronLeft sx={{ fontSize: 18 }} /></button>
                    <button disabled={!paginator.next} onClick={() => setPage(page + 1)} className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30"><ChevronRight sx={{ fontSize: 18 }} /></button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Featured Tab */}
        {activeTab === 'featured' && (
          <div>
            <p className="text-sm text-neutral-500 mb-4">These products appear in the "Featured Products" section on the homepage.</p>
            {featured.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <Star sx={{ fontSize: 32, color: '#d4d4d4' }} />
                <p className="text-sm font-semibold text-neutral-800 mt-3">No featured products</p>
                <p className="text-xs text-neutral-400 mt-1">Add products from your catalog to feature on the homepage.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featured.map((item, idx) => (
                  <div key={item.id || idx} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                      {item.badge && (
                        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: item.badgeColor || '#0a0a0a' }}>
                          {item.badge}
                        </span>
                      )}
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{item.categoryLabel || item.category?.replace(/-/g, ' ')}</p>
                      <a href={`/collection/${item.category || 'wireless-earphones'}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-neutral-900 truncate block hover:text-blue-600 hover:underline transition-colors mt-0.5">
                        {item.name}
                      </a>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-sm font-bold text-neutral-900">₹{item.price?.toLocaleString()}</span>
                        {item.mrp && <span className="text-xs text-neutral-400 line-through">₹{item.mrp?.toLocaleString()}</span>}
                      </div>
                      <div className="flex gap-2 mt-3 pt-2 border-t border-neutral-100">
                        <button onClick={() => setEditCuratedModal({ type: 'featured', index: idx, item: { ...item } })} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors">
                          <Edit sx={{ fontSize: 13 }} /> Edit
                        </button>
                        <button onClick={() => removeFromCurated('featured', item.id)} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Delete sx={{ fontSize: 13 }} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div>
            <p className="text-sm text-neutral-500 mb-4">These products appear in the "Trending Products" section on the homepage.</p>
            {trending.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <TrendingUp sx={{ fontSize: 32, color: '#d4d4d4' }} />
                <p className="text-sm font-semibold text-neutral-800 mt-3">No trending products</p>
                <p className="text-xs text-neutral-400 mt-1">Add products from your catalog to mark as trending.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trending.map((item, idx) => (
                  <div key={item.id || idx} className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-4 hover:shadow-md transition-all group">
                    <div className="w-20 h-20 rounded-xl bg-neutral-50 overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={`/collection/${item.category || 'wireless-earphones'}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-neutral-900 truncate block hover:text-blue-600 hover:underline transition-colors">
                        {item.name}
                      </a>
                      <p className="text-xs text-neutral-400 mt-0.5">{item.tagline}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-bold text-neutral-900">₹{item.price?.toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 line-through">₹{item.mrp?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditCuratedModal({ type: 'trending', index: idx, item: { ...item } })} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors">
                        <Edit sx={{ fontSize: 16 }} />
                      </button>
                      <button onClick={() => removeFromCurated('trending', item.id)} className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors">
                        <Delete sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Picker Modal */}
      {addPickerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddPickerOpen(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-neutral-100 shrink-0">
              <h2 className="text-lg font-semibold text-neutral-900">
                Add to {addPickerOpen === 'featured' ? 'Featured' : 'Trending'}
              </h2>
              <button onClick={() => setAddPickerOpen(null)} className="p-1 rounded-lg hover:bg-neutral-100"><Close sx={{ fontSize: 20 }} /></button>
            </div>
            <div className="p-4 border-b border-neutral-100 shrink-0">
              <div className="relative">
                <Search sx={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" value={pickerSearch} onChange={(e) => searchPicker(e.target.value)} placeholder="Search products..." className="w-full h-10 pl-9 pr-4 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {pickerLoading ? (
                <p className="text-center text-sm text-neutral-400 py-8">Loading...</p>
              ) : pickerProducts.length === 0 ? (
                <p className="text-center text-sm text-neutral-400 py-8">No products found</p>
              ) : (
                pickerProducts.map((p) => {
                  const alreadyAdded = addPickerOpen === 'featured'
                    ? featured.some((f) => f.id === p.id)
                    : trending.some((t) => t.id === p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => !alreadyAdded && addToCurated(addPickerOpen, p)}
                      disabled={alreadyAdded}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${alreadyAdded ? 'opacity-50 cursor-not-allowed bg-neutral-50' : 'hover:bg-neutral-50'}`}
                    >
                      {p.image ? <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0" /> : <div className="w-12 h-12 rounded-lg bg-neutral-100 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">{p.title?.shortTitle || '-'}</p>
                        <p className="text-xs text-neutral-400">{p.category?.replace(/-/g, ' ')} · ₹{p.price?.cost}</p>
                      </div>
                      {alreadyAdded ? (
                        <span className="text-xs text-neutral-400 shrink-0">Added</span>
                      ) : (
                        <Add sx={{ fontSize: 18, color: '#525252' }} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Curated Item Modal */}
      {editCuratedModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditCuratedModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-neutral-900">Edit {editCuratedModal.type === 'featured' ? 'Featured' : 'Trending'} Product</h2>
              <button onClick={() => setEditCuratedModal(null)} className="p-1 rounded-lg hover:bg-neutral-100"><Close sx={{ fontSize: 20 }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input value={editCuratedModal.item.name} onChange={(e) => setEditCuratedModal({ ...editCuratedModal, item: { ...editCuratedModal.item, name: e.target.value } })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Price</label>
                  <input type="number" value={editCuratedModal.item.price} onChange={(e) => setEditCuratedModal({ ...editCuratedModal, item: { ...editCuratedModal.item, price: Number(e.target.value) } })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">MRP</label>
                  <input type="number" value={editCuratedModal.item.mrp} onChange={(e) => setEditCuratedModal({ ...editCuratedModal, item: { ...editCuratedModal.item, mrp: Number(e.target.value) } })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Image URL</label>
                <input value={editCuratedModal.item.image} onChange={(e) => setEditCuratedModal({ ...editCuratedModal, item: { ...editCuratedModal.item, image: e.target.value } })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" />
              </div>
              {editCuratedModal.type === 'featured' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Badge</label>
                  <select value={editCuratedModal.item.badge || ''} onChange={(e) => { const opt = BADGE_OPTIONS.find((b) => b.value === e.target.value); setEditCuratedModal({ ...editCuratedModal, item: { ...editCuratedModal.item, badge: opt?.value || null, badgeColor: opt?.color || null } }); }} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white">
                    {BADGE_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>
              )}
              {editCuratedModal.type === 'trending' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Tagline</label>
                  <input value={editCuratedModal.item.tagline || ''} onChange={(e) => setEditCuratedModal({ ...editCuratedModal, item: { ...editCuratedModal.item, tagline: e.target.value } })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" />
                </div>
              )}
              <button onClick={saveCuratedEdit} className="w-full h-10 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-neutral-900">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-neutral-100"><Close sx={{ fontSize: 20 }} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Short Title</label>
                  <input value={form.shortTitle} onChange={(e) => setForm({ ...form, shortTitle: e.target.value })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Long Title</label>
                  <input value={form.longTitle} onChange={(e) => setForm({ ...form, longTitle: e.target.value })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" required>
                    <option value="">Select...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Tag Line</label>
                  <input value={form.tagLine} onChange={(e) => setForm({ ...form, tagLine: e.target.value })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">MRP</label>
                  <input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Selling Price</label>
                  <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Discount Label</label>
                  <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white" placeholder="e.g. 30% off" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Product Image</label>
                {form.image && <img src={form.image} alt="" className="w-20 h-20 rounded-xl object-cover mb-2 bg-neutral-100" />}
                <label className="inline-flex items-center gap-2 h-9 px-4 bg-neutral-100 hover:bg-neutral-200 text-sm text-neutral-700 font-medium rounded-xl cursor-pointer transition-colors">
                  <CloudUpload sx={{ fontSize: 18 }} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full h-9 px-3 mt-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none" placeholder="Or paste image URL" />
              </div>
              <button type="submit" disabled={saving} className="w-full h-10 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors">
                {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
