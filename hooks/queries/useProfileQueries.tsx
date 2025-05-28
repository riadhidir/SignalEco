import { getuserProfile } from "@/api/profile";
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = (userId: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      return await getuserProfile(userId);
    },
  });
};
