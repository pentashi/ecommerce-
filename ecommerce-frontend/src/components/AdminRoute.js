import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // Access the user from Redux store (we assume user has an isAdmin property)
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);  // Access token from Redux

  // If there's no user or no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the user is not an admin, redirect to the regular dashboard
  if (user && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is an admin, render the admin routes/components
  return <Outlet />;
};

export default AdminRoute;
