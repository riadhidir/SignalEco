import type { TchangePasswordSchema, TeditProfileSchema, TsignIn } from "@/utils/schemas";
import type { Profile } from "@/utils/types";
import { api } from "@/utils/axios";




export const getuserProfile = async (userID : string) : Promise<Profile> => {
    const res = await api.get(`/users/${userID}`);
    return res.data
}


export const editProfile = async (data : TeditProfileSchema) => {
    const res =  await api.post("/users", data)
    return res.data
}

export const changePassword = async (data : TchangePasswordSchema) => {
    const res =  await api.post("/users", data)
    return res.data
}
