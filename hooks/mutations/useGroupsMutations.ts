import { addCollectorsToGroup, createGroup, updateGroup } from "@/api/groups";
import { handleApiError } from "@/utils/apiErrorHandler";
import { queryClient } from "@/utils/queryClient";
import type { TaddCollectorSchema, TaddGroupSchema } from "@/utils/schemas";
import { showSuccess } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";


export const useCreateGroup = () => {
    //const {logIn} = useContext(AuthContext)
    const {back} = useRouter()
    return useMutation({
        mutationFn: async (data: TaddGroupSchema) => await createGroup(data),
    onSuccess: () => {
        back()
        queryClient.invalidateQueries({queryKey:["groups"]})
      showSuccess("Group created successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 






export const useUpdateGroup = (id: string) => {
    //const {logIn} = useContext(AuthContext)
    const {back} = useRouter()
    return useMutation({
        mutationFn: async (data: TaddGroupSchema) => await updateGroup(id,data),
    onSuccess: () => {
        back()
        queryClient.invalidateQueries({queryKey: ["groups", id,"group"]})
      showSuccess("Group updated successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 
export const useAddCollectorsToGroup = (id: string) => {
    //const {logIn} = useContext(AuthContext)

    return useMutation({
        mutationFn: async (collectorIds: string[]) => await addCollectorsToGroup(collectorIds,id)
});
} 





