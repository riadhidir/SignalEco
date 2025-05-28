import { signInApi } from "@/api/auth";
import type { TsignIn } from "@/utils/schemas";
import { handleApiError } from "@/utils/apiErrorHandler";
import { AuthContext } from "@/utils/authContext";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";


export const useSignIn = () => {
    const {logIn} = useContext(AuthContext)
    return useMutation({
        mutationFn: async (data: TsignIn) => await signInApi(data),
    onSuccess: () => {
        console.log("success")
      logIn({ isLoggedIn: true, avatar: "", role: "ADMIN" });
    },
    onError: (error) => {
        handleApiError(error)
    },
});
} 