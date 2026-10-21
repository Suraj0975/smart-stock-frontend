import api from "../lib/axios";

const productService = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post("/products", product),
  update: (id, product) => api.put(`/products/${id}`, product),
  remove: (id) => api.delete(`/products/${id}`)
};

export default productService;