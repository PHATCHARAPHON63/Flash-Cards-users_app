import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom"
import Errorpage from "../views/pages/authentication/authentication3/404"
const LoadingToRedirect =() =>{
    const [ count, setCount] = useState(3)
    const navigate = useNavigate()

    useEffect(() =>{
        const interval = setInterval(() =>{
            setCount((currentCount) => --currentCount)
        },1000)

        count === 0 && navigate('/pages/login/login3')
        return () => clearInterval(interval)
    },[count])

    return <Errorpage/>;
};
export default LoadingToRedirect;