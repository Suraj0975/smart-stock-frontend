import api from "../lib/axios";

const saleService = {
  getAll: () => api.get("/sales"),
  getById: (id) => api.get(`/sales/${id}`),
  create: (sale) => api.post("/sales", sale)
};

export default saleService;