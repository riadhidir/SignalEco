import type { TaddCollectionPointSchema, TaddScheduleSchema } from "@/utils/schemas"
import type { CollectionPoint, GetCollectionPoints, WasteReport } from "@/utils/types"
import { api } from "@/utils/axios"




export const getCollectionPoints = async () : Promise<GetCollectionPoints[]>=> {
    const res =  await api.get("/reports")
    return res.data
}


export const getCollectionPoint = async (id : string) : Promise<CollectionPoint>=> {
    const res =  await api.get(`/reports/${id}`)
    return res.data
}

export const deleteCollectionPoint = async (id: string) => {
    const res = await api.delete(`/reports/${id}`)
    return res.data
}

export const updateCollectionPoint = async (data : TaddCollectionPointSchema) => {
    const res = await api.put("/products", data);
    return res.data
}
export const createCollectionPoint = async (data : TaddCollectionPointSchema) => {
    const res = await api.post("/products", data);
    return res.data
}

export const addSchedule = async (collectionId : string, data: TaddScheduleSchema)=> {
    const res  = await api.post("/products",data);
    return res.data
}
export const updateSchedule = async (id : string, data: TaddScheduleSchema)=> {
    const res  = await api.put(`/products/${id}`,data);
    return res.data
}


export const deleteSchedule = async (id:string) => {
    const res = await api.delete('/products/8');
    return res.data
}
export const getWasteReports = async () : Promise<WasteReport[]>=> {

    const res = await api.get("/reports");
    return res.data
}
export const getWasteReport = async (id:string) : Promise<WasteReport>=> {

    const res = await api.get(`/reports/${id}`);
    return res.data
}