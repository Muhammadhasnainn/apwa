import React from 'react'
import { useAuthContext } from './AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { user } = useAuthContext();
    
    if (!user) {
        return <Navigate to={"/"} />
    }

    return children;
}

export default ProtectedRoute