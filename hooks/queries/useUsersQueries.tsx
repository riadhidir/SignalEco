import { getUser, getUsers } from "@/api/users";
import type { GetCollectorsSearchParams } from "@/utils/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetUsers = ({ name }: GetCollectorsSearchParams) => {
  return useInfiniteQuery({
    queryKey: ["users", name],
    queryFn: async ({ pageParam = 1 }) => {
      return await getUsers({ page: pageParam, name });
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      //TODO: add proper typing for the result of the api
      return nextPage <= lastPage.data.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};

export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      return await getUser(userId);
    },
  });
};
