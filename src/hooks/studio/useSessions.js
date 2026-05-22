import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionService } from "@/services/sessionService";
import toast from "react-hot-toast";

export const useSessionDates = () => {
  return useQuery({
    queryKey: ["session-dates"],
    queryFn: () =>
      sessionService.getAllSessions().then((res) => {
        const sessions = res.data.data;
        const unique = [...new Set(sessions.map((s) => s.date))];
        return unique.map((d) => new Date(d));
      }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSessions = (date, options = {}) => {
  return useQuery({
    queryKey: ["sessions", date],
    queryFn: () => sessionService.getAllSessions(date).then(res => res.data),
    enabled: !!date,                
    staleTime: 1 * 60 * 1000,
    ...options,
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