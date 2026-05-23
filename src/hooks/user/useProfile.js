import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/profileService";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getMe().then((res) => res.data),
    staleTime: 60_000,
  });
