import { changePassword, editProfile } from "@/api/profile";
import type { TchangePasswordSchema, TeditProfileSchema } from "@/utils/schemas";
import { handleApiError } from "@/utils/apiErrorHandler";
import { showSuccess } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";


export const useEditProfile = () => {
    //const {logIn} = useContext(AuthContext)
    const {back} = useRouter()
    return useMutation({
        mutationFn: async (data: TeditProfileSchema) => await editProfile(data),
    onSuccess: () => {
        back()
      showSuccess("Profile updated successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 


export const useChangePassword = () => {
    //const {logIn} = useContext(AuthContext)
    const {back} = useRouter()
   
    return useMutation({
        mutationFn: async (data: TchangePasswordSchema) => await changePassword(data),
    onSuccess: () => {
        back()
      showSuccess("Password changed successfully")
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 