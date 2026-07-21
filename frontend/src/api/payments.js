import api from "./axios";

export const createRazorpayOrder = () => api.post("/payments/razorpay/create-order");
