import axios from "@/api/axios";

export const paymentService = {
  getPaymentById: (id) => axios.get(`/payments/${id}`),
  getPaymentStatusById: (id) => axios.get(`/payments/${id}/status`),
};
