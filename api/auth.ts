import type { TsignIn } from "@/schemas";
import { api } from "@/utils/axios";



export const signInApi = async (data : TsignIn) => {
    const res =  await api.post("/users", data)
    return res.data
}
