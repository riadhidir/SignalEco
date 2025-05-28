import type { GetCollectors, GetNotificationsSearchParams } from "@/utils/types";
import { api } from "@/utils/axios"
import axios from "axios";



export const getStatistics = async  ()=> {
    const res = await api.get("/groups");
    return res.data
}

export const getNotifications = async ({userId,page}:GetNotificationsSearchParams):Promise<GetCollectors>=> {

    // const res = await api.get("/products");
    // return res.data
    const res = await axios.get(`https://app.profidel.com.dz/api/products?currentPage=${page}`)
    return res.data
}


