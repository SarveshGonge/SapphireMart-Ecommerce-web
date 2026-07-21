import api from "./axios";

export const fetchCart = () => api.get("/cart");
export const addToCart = (productId, quantity = 1) => api.post("/cart/add", { productId, quantity });
export const updateCartItem = (cartItemId, quantity) => api.put(`/cart/${cartItemId}`, { quantity });
export const removeCartItem = (cartItemId) => api.delete(`/cart/${cartItemId}`);
