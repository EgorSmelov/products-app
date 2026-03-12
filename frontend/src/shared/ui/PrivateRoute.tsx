import React from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactElement
}

const hasToken = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const token =
    window.localStorage.getItem('token') ?? window.sessionStorage.getItem('token')

  return Boolean(token)
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  if (!hasToken()) {
    return <Navigate to="/login" replace />
  }

  return children
}

