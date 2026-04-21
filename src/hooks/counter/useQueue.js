// hooks/counter/useQueue.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queueService } from "@/services/queueService";
import toast from "react-hot-toast";

// ====================== CHECK-IN (Registration Counter) ======================
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingNumber) => queueService.checkIn(bookingNumber),

    onSuccess: () => {
      toast.success("Check-in successful");
      queryClient.invalidateQueries({ queryKey: ["activeQueue"] });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to check-in");
    },
  });
};

// ====================== CALL NEXT ======================
export const useCallNext = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studioId }) => queueService.callNext(studioId),
    onSuccess: () => {
      toast.success("Next customer called");
      queryClient.invalidateQueries({ queryKey: ["activeQueue"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to call next"),
  });
};

// ====================== CONFIRM ARRIVAL ======================
export const useConfirmArrival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (queueId) => queueService.confirmArrival(queueId),
    onSuccess: () => {
      toast.success("Arrival confirmed - Session started");
      queryClient.invalidateQueries({ queryKey: ["activeQueue"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to confirm arrival"),
  });
};

// ====================== CHECK-OUT ======================
export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ queueId }) => queueService.checkOut(queueId),
    onSuccess: () => {
      toast.success("Check-out successful");
      queryClient.invalidateQueries({ queryKey: ["activeQueue"] });
      queryClient.invalidateQueries({ queryKey: ["studios"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to check-out"),
  });
};