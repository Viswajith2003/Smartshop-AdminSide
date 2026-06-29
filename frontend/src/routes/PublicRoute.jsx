import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../components/common/Loader'

const PublicRoute = React.memo(({ children, redirectTo = "/admin/dashboard" }) => {
  const { isAdminAuthenticated, loading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (loading) {
    return <Loader fullScreen text="Loading..." />
  }

  if (isAdminAuthenticated) {
    let from = location.state?.from?.pathname || redirectTo;
    
    // Prevent redirecting to the same page (infinite loop)
    if (from === location.pathname) {
      from = "/admin/dashboard";
    }
    
    // Final check: if still the same, don't redirect
    if (from === location.pathname) {
        return children;
    }

    return <Navigate to={from} replace />
  }

  return children
})

export default PublicRoute;
