import { useQuery } from "@tanstack/react-query";
import { queueService } from "@/services/queueService";

export const useBookingDetails = (bookingNumber) => {
  return useQuery({
    queryKey: ["bookingDetails", bookingNumber],
    queryFn: () => queueService.getBookingByNumber(bookingNumber).then(res => res.data),
    enabled: !!bookingNumber,           // Only run when bookingNumber exists
    staleTime: 0,                       // Always fetch fresh data on scan
    cacheTime: 5 * 60 * 1000,           // Keep in cache for 5 minutes
    retry: 1,
  });
};