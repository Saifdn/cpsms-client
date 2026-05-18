// services/shipmentService.js
import axios from "@/api/axios";

export const shipmentService = {
  // Get all pending shipments (paid bookings without shipment)
  getPendingShipments: () => 
    axios.get("/shipments/pending"),

  getSubmittedShipments: () => 
    axios.get("/shipments/submitted"),

  // Get quotation for selected booking IDs
  getQuotation: (bookingIds) => 
    axios.post("/shipments/quotation", { bookingIds }),

  submitOrder: ({
    bookingIds,
    serviceId,
    serviceName,
    courierName,
    collectionDate,
    sender,
    packageDetails,
    features,
  }) =>
    axios.post("/shipments/submit", {
      bookingIds,
      serviceId,
      serviceName,
      courierName,
      collectionDate,
      sender,
      packageDetails,
      features,
    }),

  getWalletBalance: () =>
    axios.get("/shipments/wallet"),
};