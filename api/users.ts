
import type { GetCollectors, GetCollectorsSearchParams, Profile } from "@/utils/types";
import { api } from "@/utils/axios";
import axios from "axios";



export const getUsers = async ({page,name}: GetCollectorsSearchParams) : Promise<GetCollectors> => {
    // const res = await api.get(`/users`);
    // return res.data
   
    const res = await axios.get(`https://app.profidel.com.dz/api/products?currentPage=${page}&name=${name}`)
    return res.data
}




export const getUser = async (id:string) : Promise<Profile> => {
     const res = await api.get(`/users/${id}`);
     return res.data

}



export const suspendUser = async (id: string) => {
    const res =  await api.put(`/users/${id}`)
    return res.data
}
