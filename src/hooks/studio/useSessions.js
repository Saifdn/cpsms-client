import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionService } from "@/services/sessionService";
import toast from "react-hot-toast";

export const useSessions = (date) => {
  return useQuery({
    queryKey: ["sessions", date],
    queryFn: () => sessionService.getAllSessions(date).then(res => res.data),
  });
};

export const useGenerateSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionService.generateSessions,
    onSuccess: (response) => {
      toast.success(`Successfully generated ${response.data.count || 0} sessions`);
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to generate sessions");
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => sessionService.updateSession(id, data),
    onSuccess: () => {
      toast.success("Session updated successfully");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update session");
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionService.deleteSession,
    onSuccess: () => {
      toast.success("Session deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete session");
    },
  });
};