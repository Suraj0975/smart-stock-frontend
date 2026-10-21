import api from "../lib/axios";

const analyticsService = {
  getDashboard: () => api.get("/analytics/dashboard"),
  getSales: (params = {}) =>
    api.get("/analytics/sales", { params }),
  getInventory: (params = {}) =>
    api.get("/analytics/inventory", { params })
};

export default analyticsService;