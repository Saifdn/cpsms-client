import axios from "@/api/axios";

export const reportService = {
  getEventSummary: ({ period, startDate, endDate } = {}) =>
    axios.get("/reports/event-summary", {
      params: {
        period: period || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
    }),

  getDailyDrillDown: (date) =>
    axios.get("/reports/daily", { params: { date } }),
};
