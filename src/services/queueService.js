import axios from "@/api/axios";

export const queueService = {
  // Check-in (creates queue entry)
  checkIn: (data) => axios.post("/queue/checkin", data),

  // Get current active queue (for waiting screen)
  getActiveQueue: () => axios.get("/queue/active"),

  // Call next person (when studio is free)
  callNext: (studioId) => axios.post("/queue/call-next", { studioId }),

  confirmArrival: (queueId) => 
    axios.post("/queue/confirm-arrival", { queueId }),

  // Check-out (when user finishes)
  checkOut: (queueId) => axios.post("/queue/checkout", { queueId }),

  // Add this inside the queueService object
  getBookingByNumber: (bookingNumber) =>
    axios.get(`/bookings/number/${bookingNumber}`),
};
