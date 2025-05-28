
import type { GetCollectors, GetCollectorsSearchParams, Group, Profile } from "@/utils/types";
import { api } from "@/utils/axios";
import axios from "axios";
import type { TaddGroupSchema } from "@/utils/schemas";



export const getGroups = async ({page,name}: GetCollectorsSearchParams) : Promise<Group[]> => {
    // const res = await api.get(`/users`);
    // return res.data
   
   // const res = await axios.get(`https://app.profidel.com.dz/api/products?currentPage=${page}&name=${name}`)
   const res = await api.get('/groups')
   
    return res.data


}





export const getGroup = async (id:string) : Promise<Group> => {
     const res = await api.get(`/groups/${id}`);
     return res.data

}

export const createGroup = async (data:TaddGroupSchema) => {
    const res  = await api.post(`/groups`,data);
    return res.data
}


export const updateGroup = async (id: string, data: TaddGroupSchema) => {
    const res =  await api.put(`/groups/${id}`,data)
    return res.data
}

export const deleteGroup = async (id:string) => {
    const res = await api.delete(`/groups/${id}`)
    return res.data
}


export const addCollectorsToGroup = async (collectorsIds : string[],groupId: string) => {

    const res  = await api.put(`/groups/${groupId}`,{members: collectorsIds});
    return res.data
}

export const removeCollectorFromGroup = async (collectorId:string, groupId:string) => {
    const res = await api.delete(`/users/${collectorId}`)
    return res.data
}

