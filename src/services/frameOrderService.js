import axios from "@/api/axios";

export const frameOrderService = {
  getMyOrders: ({ status } = {}) =>
    axios.get("/frame-orders/my-orders", { params: { status: status || undefined } }),

  getMyOrderById: (id) => axios.get(`/frame-orders/my-orders/${id}`),

  createOrder: (data) => axios.post("/frame-orders", data),

  cancelOrder: (id) => axios.put(`/frame-orders/${id}/cancel`),

  getAllOrders: ({ status, search, page = 1, limit = 20 } = {}) =>
    axios.get("/frame-orders", {
      params: { status: status || undefined, search: search || undefined, page, limit },
    }),

  getOrderById: (id) => axios.get(`/frame-orders/${id}`),

  adminCreateOrder: (data) => axios.post("/frame-orders/admin", data),

  updateOrder: (id, data) => axios.put(`/frame-orders/${id}`, data),
};
