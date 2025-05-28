import { addCollector, deleteCollector, suspendCollector } from "@/api/collectors";
import { handleApiError } from "@/utils/apiErrorHandler";
import { queryClient } from "@/utils/queryClient";
import type { TaddCollectorSchema } from "@/utils/schemas";
import { showSuccess } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";


export const useAddCollector = () => {
    //const {logIn} = useContext(AuthContext)
    const {back} = useRouter()
    return useMutation({
        mutationFn: async (data: TaddCollectorSchema) => await addCollector(data),
    onSuccess: () => {
        back()
      showSuccess("Collector created successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 

export const useSuspendCollector = (id: string) => {
    //const {logIn} = useContext(AuthContext)
    
    return useMutation({
        mutationFn: async () => await suspendCollector(id),
    onSuccess: () => {
      showSuccess("Collector suspended successfully")

    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 


export const useDeleteCollector = (id: string) => {
    //const {logIn} = useContext(AuthContext)
    const {back} = useRouter()
    return useMutation({
        mutationFn: async () => await deleteCollector(id),
    onSuccess: () => {
        back()
        queryClient.invalidateQueries({queryKey: ["collectors"]})
      showSuccess("Collector deleted successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 





