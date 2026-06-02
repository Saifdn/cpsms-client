import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";

export const useEventSummary = ({ period, startDate, endDate } = {}) =>
  useQuery({
    queryKey: ["reports", "event-summary", { period, startDate, endDate }],
    queryFn: () =>
      reportService
        .getEventSummary({ period, startDate, endDate })
        .then((res) => res.data),
    staleTime: 60_000,
  });

export const useDailyDrillDown = (date) =>
  useQuery({
    queryKey: ["reports", "daily", date],
    queryFn: () =>
      reportService.getDailyDrillDown(date).then((res) => res.data),
    staleTime: 60_000,
    enabled: !!date,
  });
