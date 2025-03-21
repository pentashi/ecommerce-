import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth.token);
  
  console.log('ProtectedRoute: Token:', token); // Debugging

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, allow them to access protected pages
  return <Outlet />;
};

export default ProtectedRoute;
