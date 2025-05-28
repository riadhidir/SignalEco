import { getCollector, getCollectors } from "@/api/collectors";
import type { GetCollectorsSearchParams } from "@/utils/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetCollectors = ({ name }: GetCollectorsSearchParams) => {
  return useInfiniteQuery({
    queryKey: ["collectors", name],
    queryFn: async ({ pageParam = 1 }) => {
      return await getCollectors({ page: pageParam, name });
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      //TODO: add proper typing for the result of the api
      return nextPage <= lastPage.data.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};

export const useGetCollectorProfile = (userId: string) => {
  return useQuery({
    queryKey: ["Collectorprofile", userId],
    queryFn: async () => {
      return await getCollector(userId);
    },
  });
};
