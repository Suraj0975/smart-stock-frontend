import api from "../lib/axios";

const predictionService = {
  getPredictions: (params = {}) =>
    api.get("/predictions", { params }),

  predictProduct: (productId) =>
    api.get(`/predictions/${productId}`)
};

export default predictionService;