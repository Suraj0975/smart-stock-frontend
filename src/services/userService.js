import api from "../lib/axios";

const userService = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post("/users", user),
  update: (id, user) => api.put(`/users/${id}`, user),
  remove: (id) => api.delete(`/users/${id}`)
};

export default userService;