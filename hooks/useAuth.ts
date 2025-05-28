import { AuthContext } from "@/utils/authContext"
import { useContext } from "react"




export const useAuth = ()=> {
    const {session, isReady,logIn,logOut} = useContext(AuthContext);
    return {...session,isReady,logIn, logOut}
}