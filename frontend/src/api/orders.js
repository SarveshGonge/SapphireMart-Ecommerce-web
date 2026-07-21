import api from "./axios";

export const checkout = (payload) => api.post("/orders/checkout", payload);
export const fetchMyOrders = ({ page = 0, size = 10 } = {}) => api.get("/orders", { params: { page, size } });
export const fetchAllOrders = ({ page = 0, size = 10 } = {}) => api.get("/admin/orders", { params: { page, size } });
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, status, {
  headers: { "Content-Type": "application/json" },
});
