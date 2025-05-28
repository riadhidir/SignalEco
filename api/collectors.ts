import type { TaddCollectorSchema } from "@/utils/schemas";
import type { GetCollectors, GetCollectorsSearchParams, Profile } from "@/utils/types";
import { api } from "@/utils/axios";
import axios from "axios";



export const getCollectors = async ({page,name}: GetCollectorsSearchParams) : Promise<GetCollectors> => {
    // const res = await api.get(`/users`);
    // return res.data
   
    const res = await axios.get(`https://app.profidel.com.dz/api/products?currentPage=${page}&name=${name}`)
    return res.data
}



export const addCollector = async (data : TaddCollectorSchema) => {
    const res =  await api.post("/users", data)
    return res.data
}

export const getCollector = async (id:string) : Promise<Profile> => {
     const res = await api.get(`/users/${id}`);
     return res.data

}



export const suspendCollector = async (id: string) => {
    const res =  await api.put(`/users/${id}`)
    return res.data
}

export const deleteCollector = async (id: string) => {
    const res =  await api.delete(`/users/${id}`)
    return res.data
}
