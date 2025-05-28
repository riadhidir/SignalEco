import { getNotifications, getStatistics } from "@/api/util";
import type { GetNotificationsSearchParams } from "@/utils/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetStatistics = () => {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: async () => await getStatistics(),
  });
};

export const useGetNotifications = ({
  userId,
  page,
}: GetNotificationsSearchParams) => {
  return useInfiniteQuery({
    queryKey: ["notifications", userId],
    queryFn: async ({ pageParam = page || 0 }) => {
      return await getNotifications({ page: pageParam, userId });
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      //TODO: add proper typing for the result of the api
      return nextPage <= lastPage.data?.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};
