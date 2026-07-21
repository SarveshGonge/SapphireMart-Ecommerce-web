import api from "./axios";

export const fetchProducts = ({ page = 0, size = 12, category, search, sort } = {}) =>
  api.get("/products", { params: { page, size, category, search, sort } });

export const fetchProduct = (id) => api.get(`/products/${id}`);

export const createProduct = (data) => api.post("/admin/products", data);
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
