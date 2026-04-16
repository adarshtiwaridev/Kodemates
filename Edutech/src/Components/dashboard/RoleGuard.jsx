import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleGuard = ({ allowedRoles = [], children }) => {
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.profile?.user || state.auth?.user);
  const currentRole = user?.accountType || user?.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleGuard;
