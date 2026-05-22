import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: dashboardService.getOverview,
    
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
  });
};