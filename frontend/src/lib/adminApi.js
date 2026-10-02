import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_HOST}/admin`;

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

function listBody(query = {}, page = 1, limit = 10, opts = {}) {
  return {
    query,
    options: {
      page,
      limit,
      pagination: true,
      sort: { createdAt: -1 },
      ...opts,
    },
    isCountOnly: false,
  };
}

function countBody(query = {}) {
  return { query, options: {}, isCountOnly: true };
}

export const adminAuth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/user/me'),
};

export const adminUsers = {
  list: (page, limit, query) =>
    api.post('/user/list', listBody(query, page, limit)),
  get: (id) => api.get(`/user/get/${id}`),
  create: (data) => api.post('/user/create', data),
  update: (id, data) => api.put(`/user/update/${id}`, data),
  softDelete: (id) => api.delete(`/user/soft-delete/${id}`),
  delete: (id) => api.delete(`/user/delete/${id}`),
  count: (query) => api.post('/user/count', countBody(query)),
};

export const adminProducts = {
  list: (page, limit, query) =>
    api.post('/product/list', listBody(query, page, limit)),
  get: (id) => api.get(`/product/get/${id}`),
  create: (data) => api.post('/product/create', data),
  update: (id, data) => api.put(`/product/update/${id}`, data),
  softDelete: (id) => api.delete(`/product/soft-delete/${id}`),
  delete: (id) => api.delete(`/product/delete/${id}`),
  count: (query) => api.post('/product/count', countBody(query)),
};

export const adminOrders = {
  list: (page, limit, query) =>
    api.post(
      '/order/list',
      listBody(query, page, limit, { populate: 'userId products.productId' })
    ),
  get: (id) => api.get(`/order/get/${id}`),
  update: (id, data) => api.put(`/order/update/${id}`, data),
  softDelete: (id) => api.delete(`/order/soft-delete/${id}`),
  count: (query) => api.post('/order/count', countBody(query)),
};

export const adminPayments = {
  list: (page, limit, query) =>
    api.post(
      '/payment/list',
      listBody(query, page, limit, { populate: 'userId' })
    ),
  get: (id) => api.get(`/payment/get/${id}`),
  count: (query) => api.post('/payment/count', countBody(query)),
};

export const adminUpload = {
  upload: (formData) =>
    api.post('/file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
