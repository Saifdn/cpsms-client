import axios from "@/api/axios";

export const bookingService = {
  getAllBookings: () => axios.get("/bookings"),
  getBookingById: (id) => axios.get(`/bookings/${id}`),
  createBooking: (data) => axios.post("/bookings", data),
  updateBooking: (id, data) => axios.put(`/bookings/${id}`, data),
  cancelBooking: (id) => axios.put(`/bookings/${id}/cancel`),
  deleteBooking: (id) => axios.delete(`/bookings/${id}`),
};
