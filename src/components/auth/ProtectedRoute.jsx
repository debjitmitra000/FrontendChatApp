import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = ({children,user,redirect="/login"}) => {
  if(!user){
    return <Navigate to={redirect}/>;
  }else{
    return children ? children : <Outlet/>
  }
}

export default ProtectedRoute