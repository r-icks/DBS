import { Navigate } from "react-router-dom"
import { useAppContext } from "../context/appContext"
import Loading from "./Loading"

export const StudentProtect = ({children}) => {
    const {user, userLoading} = useAppContext()
    if(userLoading) return <Loading />
    if(!user) return <Navigate to="/"/>
    if(user.userRole==="student"){
     return children;
    }
    if(user.userRole==="admin"){
      return <Navigate to="/admin" />
     }
     if(user.userRole==="teacher"){
      return <Navigate to="/faculty" />
     }
}