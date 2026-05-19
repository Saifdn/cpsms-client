// hooks/easyparcel/useEasyParcel.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { easyParcelService } from "@/services/easyParcelService";
import toast from "react-hot-toast";

export const useEasyParcel = () => {
  const queryClient = useQueryClient();

  // Get connection status
  const statusQuery = useQuery({
    queryKey: ["easyparcel", "status"],
    queryFn: easyParcelService.getStatus,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Connect (start OAuth)
  const connectMutation = useMutation({
    mutationFn: easyParcelService.connect,
    onSuccess: () => {
      // Backend should redirect automatically, so this might not run
      toast.success("Redirecting to EasyParcel...");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to connect EasyParcel");
    },
  });

  // Disconnect
  const disconnectMutation = useMutation({
    mutationFn: easyParcelService.disconnect,
    onSuccess: () => {
      toast.success("EasyParcel account disconnected successfully");
      queryClient.invalidateQueries({ queryKey: ["easyparcel", "status"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to disconnect");
    },
  });

  return {
    // Data
    isConnected: statusQuery.data?.data?.connected || false,
    status: statusQuery.data?.data,
    isLoading: statusQuery.isLoading,

    // Actions
    connect: connectMutation.mutate,
    disconnect: disconnectMutation.mutate,
    isConnecting: connectMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,

    // Query helpers
    refetchStatus: statusQuery.refetch,
  };
};