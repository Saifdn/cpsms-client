// services/shipmentService.js
import axios from "@/api/axios";

export const shipmentService = {
  // Get all pending shipments (paid bookings without shipment)
  getPendingShipments: ({ date, page, limit } = {}) =>
    axios.get("/shipments/pending", { params: { date, page, limit } }),

  getSubmittedShipments: ({ date, page, limit } = {}) =>
    axios.get("/shipments/submitted", { params: { date, page, limit } }),

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

  mergeAwb: (shipmentIds = []) =>
    axios.post(
      "/shipments/merge-awb",
      shipmentIds.length ? { shipmentIds } : {},
      { responseType: "blob" }
    ),
};