import { addSchedule, createCollectionPoint, updateCollectionPoint, updateSchedule } from "@/api/map";
import type { TaddCollectionPointSchema, TaddScheduleSchema } from "@/utils/schemas";
import { handleApiError } from "@/utils/apiErrorHandler";
import { showSuccess } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";


export const useUpdateCollectionPoint = () => {
    //const {logIn} = useContext(AuthContext)
    const {back} = useRouter()
    return useMutation({
        mutationFn: async (data: TaddCollectionPointSchema) => await updateCollectionPoint(data),
    onSuccess: () => {
        back()
      showSuccess("Collection point updated successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 
export const useCreateCollectionPoint = () => {
    //const {logIn} = useContext(AuthContext)
    const {back} = useRouter()
    return useMutation({
        mutationFn: async (data: TaddCollectionPointSchema) => await createCollectionPoint(data),
    onSuccess: () => {
        back()
      showSuccess("Collection point created successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 


export const useCreateSchedule = (collectionId: string) => {
    //const {logIn} = useContext(AuthContext)
  
    return useMutation({
        mutationFn: async (data: TaddScheduleSchema) => await addSchedule(collectionId,data),
    onSuccess: () => {
 
      showSuccess("Schedule created successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 

export const useUpdateSchedule = (id: string) => {
    //const {logIn} = useContext(AuthContext)

    return useMutation({
        mutationFn: async (data: TaddScheduleSchema) => await updateSchedule(id,data),
    onSuccess: () => {
        
      showSuccess("Schedule updated successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 













