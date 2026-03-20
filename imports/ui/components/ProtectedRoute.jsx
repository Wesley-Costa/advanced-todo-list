import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ user, isLoading, children }) => {
  if (isLoading) return null;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};