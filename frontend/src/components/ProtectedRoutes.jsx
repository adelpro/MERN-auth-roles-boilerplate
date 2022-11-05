<<<<<<< HEAD:frontend/src/components/ProtectedRoutes.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

=======
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
>>>>>>> v4.0.6:frontend/src/components/ProtectedRoutes.js
export default function ProtectedRoutes({ allowedRoles }) {
    const { roles } = useAuth()
    const location = useLocation()
    return roles.some((role) => allowedRoles.includes(role)) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    )
}
