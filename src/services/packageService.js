import axios from "@/api/axios";

export const packageService = {
  // Packages
  getAll: () => axios.get("/packages"),
  create: (data) => axios.post("/packages", data),
  update: (id, data) => axios.put(`/packages/${id}`, data),
  delete: (id) => axios.delete(`/packages/${id}`),

  // Addons
  getAllAddons: () => axios.get("/addons"),
  createAddon: (data) => axios.post("/addons", data),
  updateAddon: (id, data) => axios.put(`/addons/${id}`, data),
  deleteAddon: (id) => axios.delete(`/addons/${id}`),

  // Promo Ads
  getAllPromoAds: () => axios.get("/promos"),
  createPromoAd: (data) => axios.post("/promos", data),
  deletePromoAd: (id) => axios.delete(`/promos/${id}`),
};