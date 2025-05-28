import { getCollector, getCollectors } from "@/api/collectors";
import { getGroup, getGroups } from "@/api/groups";
import type { GetCollectorsSearchParams } from "@/utils/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetGroups = ({ name }: GetCollectorsSearchParams) => {
  return useInfiniteQuery({
    queryKey: ["groups", name],
    queryFn: async ({ pageParam = 1 }) => {
      return await getGroups({ page: pageParam, name });
    },
    getNextPageParam: (lastPage, allPages) => {
      return undefined;
      const nextPage = allPages.length + 1;
      //TODO: add proper typing for the result of the api
      return nextPage <= lastPage.data.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};

export const useGetGroup = (id: string) => {
  return useQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      return await getGroup(id);
    },
  });
};
