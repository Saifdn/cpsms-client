import axios from "@/api/axios";

export const profileService = {
  getMe: () => axios.get("/users/me"),
};
