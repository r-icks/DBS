import { Navigate } from "react-router-dom"
import { useAppContext } from "../context/appContext"
import Loading from "./Loading"

export const AdminProtect = ({children}) => {
    const {user, userLoading} = useAppContext()
    if(userLoading) return <Loading />
    if(!user) return <Navigate to="/"/>
    if(user.userRole==="admin"){
     return children;
    }
    if(user.userRole==="student"){
      return <Navigate to="/student" />
     }
     if(user.userRole==="teacher"){
      return <Navigate to="/faculty" />
     }
}