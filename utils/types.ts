
export type Role  = "ADMIN" | "COLLECTOR";
export type WasteType = 'PLASTIQUE'|'MENAGER'|'ELECTRONIQUE'|'CHIMIQUE'|'MEDICAL'|'VERRE'| 'AUTRE'| 'PAPIER'

export type ReportStatus = "EN_ATTENTE" | "EN_COURS" | "RESOLU";
export type ReportPrio = 'CRITIQUE' | "ELEVEE" | "MOYENNE" | "FAIBLE";
export type WasteSize = "PETITE" | "MOYENNE" | "GRANDE" | "ENORME";
export interface Profile {
    id: string,
email : string,
fullName : string,
phoneNumber : string
createdAt : Date,
photo : string
}


export interface GetCollectorsSearchParams {
    page?: number,
    name?: string
}

export interface GetCollectors {
    success : boolean, 
    data: {
        totalPages: number,
        products: Array<{
            id: string,
            name: string
        }>
    }
}

export interface GetCollectionPoints {
    id:string,
    name: string,
    longitude: string,
    latitude: string,
    createdAt : Date
}

export interface CollectionPoint {
    id: string,
    name : string,
    longitude: string,
    latitude: string,
    createdAt : string,
    photo?: string
}



export interface Schedule {
    id:string,
    day : string, 
    startTime : string,
    endTime: string
}


export interface GetNotificationsSearchParams {
    page?: number,
    userId: string
}


export interface Group {
    id:string,
    name: string,
    zoneName: string,
    description: string,
    lat: number,
    long: number,
    createdAt: Date,
    members : Array<{
        name : string,
        email:string,
        id:string
    }>
    ,
    radius: number,
    wasteTypes : Array<WasteType>
}

export interface WasteReport {
    id: string,
    description: string,
    dateSignalement: Date,
    typeDeDechet : WasteType,
    tailleDechet : WasteSize,
    updatedAt : Date,
    etatSignalement : ReportStatus,
    priorite : ReportPrio;
    latitude: number,
    longitude: number,
    photos : string[]
    assignedGroup?: {
        id:string
        name: string
    }
}