import api from "../lib/axios";

const purchaseService = {
  getAll: () => api.get("/purchases"),
  getById: (id) => api.get(`/purchases/${id}`),
  create: (purchase) => api.post("/purchases", purchase)
};

export default purchaseService;