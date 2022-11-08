import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
export default function ProtectedRoutes({ allowedRoles }) {
  const { roles } = useAuth()
  //TODO error roles =[] null
  const location = useLocation()
  return roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}
