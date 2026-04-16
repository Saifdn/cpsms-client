import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queueService } from "@/services/queueService";
import toast from "react-hot-toast";

// Get active queue (waiting + in-progress)
export const useActiveQueue = () => {
  return useQuery({
    queryKey: ["activeQueue"],
    queryFn: () => queueService.getActiveQueue().then(res => res.data),
    refetchInterval: 3000,        // Real-time feel (update every 3 seconds)
    staleTime: 2000,
  });
};

// Check-in a booking (creates queue entry)
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: queueService.checkIn,
    onSuccess: (response) => {
      toast.success(`Check-in successful! Queue #${response.data.queueNumber || 'N/A'}`);
      queryClient.invalidateQueries({ queryKey: ["activeQueue"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to check-in");
    },
  });
};

// Call next person (when a studio is free)
export const useCallNext = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: queueService.callNext,
    onSuccess: (response) => {
      toast.success(`Called next customer - Queue #${response.data.queueNumber}`);
      queryClient.invalidateQueries({ queryKey: ["activeQueue"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to call next");
    },
  });
};

// Check-out current user (frees the studio)
export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: queueService.checkOut,
    onSuccess: () => {
      toast.success("Check-out successful. Studio is now available.");
      queryClient.invalidateQueries({ queryKey: ["activeQueue"] });
      queryClient.invalidateQueries({ queryKey: ["studios"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to check-out");
    },
  });
};