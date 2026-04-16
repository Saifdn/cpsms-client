import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import toast from "react-hot-toast";

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingService.getAllBookings().then(res => res.data),
  });
};

export const useBookingById = (id, enabled = false) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBookingById(id).then(res => res.data),
    enabled: !!id && enabled,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      toast.success("Booking created successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => bookingService.updateBooking(id, data),
    onSuccess: () => {
      toast.success("Booking updated successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.cancelBooking,
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.deleteBooking,
    onSuccess: () => {
      toast.success("Booking deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};