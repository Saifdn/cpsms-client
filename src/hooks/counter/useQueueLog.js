import { useQuery } from "@tanstack/react-query";
import { queueService } from "@/services/queueService";

export const useQueueLog = ({ page = 1, limit = 20, enabled = true } = {}) =>
  useQuery({
    queryKey: ["queueLog", page, limit],
    queryFn: () => queueService.getQueueLog({ page, limit }).then((r) => r.data),
    staleTime: 30_000,
    enabled,
  });
