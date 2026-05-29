import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { easyParcelService } from "@/services/easyParcelService";
import toast from "react-hot-toast";

export const useEasyParcel = () => {
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ["easyparcel", "status"],
    queryFn: easyParcelService.getStatus,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });

  // connect is a plain redirect — no mutation needed
  const connect = (userId) => easyParcelService.connect(userId);

  const disconnectMutation = useMutation({
    mutationFn: easyParcelService.disconnect,
    onSuccess: () => {
      toast.success("EasyParcel disconnected successfully");
      queryClient.invalidateQueries({ queryKey: ["easyparcel", "status"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to disconnect");
    },
  });

  return {
    isConnected: statusQuery.data?.data?.connected || false,
    status: statusQuery.data?.data,
    isLoading: statusQuery.isLoading,

    connect,
    disconnect: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,

    refetchStatus: statusQuery.refetch,
  };
};