import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import toast from "react-hot-toast";

export const useMyBookings = () => {
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: () => bookingService.getMyBookings().then(res => res.data),
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyBookingById = (id) => {
  return useQuery({
    queryKey: ["myBooking", id],
    queryFn: () => bookingService.getMyBookingById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 60_000,
  });
};

export const useBookings = ({ date = null, page = 1, limit = 20, search = "" } = {}) => {
  return useQuery({
    queryKey: ["bookings", date, page, limit, search],
    queryFn: () =>
      bookingService.getAllBookings({ date, page, limit, search }).then(res => res.data),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

export const useBookingById = (id, enabled = false) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBookingById(id).then(res => res.data),
    enabled: !!id && enabled,
  });
};

export const useCreateAdminBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.createAdminBooking,
    onSuccess: (response) => {
      toast.success(response.data.message || "Booking created successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create booking");
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingService.createBooking,

    onSuccess: (response) => {
      toast.success(response.data.message || "Booking created successfully!");

      if (response.data.paymentUrl) {
        setTimeout(() => {
          window.location.href = response.data.paymentUrl;
        }, 800);
      } else {
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
      }
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create booking");
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
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
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