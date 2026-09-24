import api from './axios';

export const getCategories = () => api.get('/products/categories');

export const getProducts = ({ page, limit, search, category, sortBy, order }) => {
  const skip = (page - 1) * limit;
  const params = { limit, skip };

  let endpoint = '/products';
  if (search) {
    endpoint = '/products/search';
    params.q = search;
  } else if (category) {
    endpoint = `/products/category/${encodeURIComponent(category)}`;
  }

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || 'asc';
  }

  return api.get(endpoint, { params });
};

export const getProduct = (id) => api.get(`/products/${id}`);

export const addProduct = (payload) => api.post('/products/add', payload);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/products/${id}`);