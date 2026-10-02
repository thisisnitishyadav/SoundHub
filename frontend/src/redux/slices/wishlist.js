import { createSlice } from '@reduxjs/toolkit';

function loadFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('wishlist', JSON.stringify(items));
}

const slice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    initWishlist(state) {
      state.items = loadFromStorage();
    },
    toggleWishlist(state, action) {
      const product = action.payload;
      const exists = state.items.find((i) => i.id === product.id);
      if (exists) {
        state.items = state.items.filter((i) => i.id !== product.id);
      } else {
        state.items = [product, ...state.items];
      }
      saveToStorage(state.items);
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveToStorage(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      saveToStorage([]);
    },
  },
});

export const { initWishlist, toggleWishlist, removeFromWishlist, clearWishlist } = slice.actions;
export const { reducer } = slice;
export default slice;
