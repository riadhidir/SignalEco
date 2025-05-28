import Axios from "axios"

export const api = Axios.create({
    baseURL : process.env.EXPO_PUBLIC_API_URL
})