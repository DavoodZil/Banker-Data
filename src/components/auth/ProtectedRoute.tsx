import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

/**
 * ProtectedRoute component that checks for authentication
 * Redirects to /unauthorized if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;