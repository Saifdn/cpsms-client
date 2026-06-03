import axios from "@/api/axios";

export const bookingService = {

  getMyBookings: () => axios.get("/bookings/my-bookings"),
  getMyBookingById: (id) => axios.get(`/bookings/my-bookings/${id}`),

  getAllBookings: ({ date, page, limit, search, status } = {}) =>
    axios.get("/bookings", { params: { date, page, limit, search: search || undefined, status: status || undefined } }),

  getBookingById: (id) => axios.get(`/bookings/${id}`),
  createBooking: (data) => axios.post("/bookings", data),
  createAdminBooking: (data) => axios.post("/bookings/admin", data),
  updateBooking: (id, data) => axios.put(`/bookings/${id}`, data),
  cancelBooking: (id) => axios.put(`/bookings/${id}/cancel`),
  deleteBooking: (id) => axios.delete(`/bookings/${id}`),
};