import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const AdminProtection = ({ children }) => {
  const token = Cookies.get("adminToken") || localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminProtection;
