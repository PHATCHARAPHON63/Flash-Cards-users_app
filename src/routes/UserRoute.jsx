import React from "react";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoutes = ({children}) =>{
    const { user } = useSelector((state) => ({...state}))

    return user && user.token ? children: <LoadingToRedirect/>
}

export default UserRoutes