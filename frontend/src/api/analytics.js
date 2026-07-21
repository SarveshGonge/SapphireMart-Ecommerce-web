import api from "./axios";

export const fetchSalesSummary = (year) =>
  api.get("/admin/analytics/sales", { params: year ? { year } : {} });
