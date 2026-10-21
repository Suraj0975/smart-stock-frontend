import api from "../lib/axios";

const categoryService = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (category) => api.post("/categories", category),
  update: (id, category) =>
    api.put(`/categories/${id}`, category),
  remove: (id) => api.delete(`/categories/${id}`)
};

export default categoryService;