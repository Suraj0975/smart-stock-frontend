import api from "../lib/axios";

const supplierService = {
  getAll: () => api.get("/suppliers"),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (supplier) => api.post("/suppliers", supplier),
  update: (id, supplier) =>
    api.put(`/suppliers/${id}`, supplier),
  remove: (id) => api.delete(`/suppliers/${id}`)
};

export default supplierService;