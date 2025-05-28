import {
  getCollectionPoint,
  getCollectionPoints,
  getWasteReport,
  getWasteReports,
} from "@/api/map";
import { useQuery } from "@tanstack/react-query";

export const useGetCollectionPoints = () => {
  return useQuery({
    queryKey: ["collectionPoints"],
    queryFn: async () => {
      return await getCollectionPoints();
    },
  });
};
export const useGetCollectionPoint = (id: string) => {
  return useQuery({
    queryKey: ["collectionPoint", id],
    queryFn: async () => {
      return await getCollectionPoint(id);
    },
  });
};

export const useGetWasteReportsPoints = (enableQuery: boolean = false) => {
  return useQuery({
    queryKey: ["wasteReportsPoints"],
    queryFn: async () => {
      return await getWasteReports();
    },
    enabled: enableQuery,
  });
};

export const useGetWasteReportPoint = (id: string) => {
  return useQuery({
    queryKey: ["wasteReportsPoints"],
    queryFn: async () => {
      return await getWasteReport(id);
    },
  });
};
