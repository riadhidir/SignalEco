import { passwordRegex } from "@/constants/globals"
import {z} from "zod"

export const signInSchema = z.object({
    email : z.string().email({message : "Invalid email"}),
    password : z.string()
})

export type TsignIn = z.infer<typeof signInSchema>

export const editProfileSchema = z.object({
    fullName : z.string().min(2),
    email : z.string().email(),
    phoneNumber : z.string().min(10, {message: "Invalid Number"}).max(10, {message: "Invalid Number"})
})

export type TeditProfileSchema = z.infer<typeof editProfileSchema>

export const changePasswordSchema = z.object({
    currentPassword  : z.string().min(1),
    newPassword: z
    .string()
    //.min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(passwordRegex, {
      message:
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
    }),
    confirmPassword: z.string()
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });

  export type TchangePasswordSchema = z.infer<typeof changePasswordSchema>



  export const addCollectorSchema = z.object({

    fullName : z.string().min(2),
    email : z.string().email(),
    phoneNumber : z.string().min(10, {message: "Invalid Number"}).max(10, {message: "Invalid Number"}),

    adress: z.string().min(1)
  })

  export type TaddCollectorSchema = z.infer<typeof addCollectorSchema>


  export const addCollectionPointSchema = z.object({
    name : z.string().min(3),
    longitude: z.number(),
    latitude: z.number(),
    photo: z.any()
  })

  export type TaddCollectionPointSchema = z.infer<typeof addCollectionPointSchema>

  export const addScheduleSchema = z.object({
    day: z.string().min(1),
    startTime : z.string(),
    endTime : z.string()
  })

  export type TaddScheduleSchema = z.infer<typeof addScheduleSchema>

  export const addGroupSchema = z.object({
    name : z.string().min(2,{message: "Required"}),
    zoneName : z.string().min(2,{message: "Required"}),
    description : z.string().min(2,{message: "Required"}),
    wasteTypes : z.enum(['PLASTIQUE','MENAGER','ELECTRONIQUE','CHIMIQUE','MEDICAL','VERRE', 'AUTRE', 'PAPIER']).array().min(1),
    members :z.string().array().optional(),
    lat :z.number(),
    long : z.number(),
    radius :z.number()
  })

  export type TaddGroupSchema = z.infer<typeof addGroupSchema>

  