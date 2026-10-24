import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const UserProtection = ({ children }) => {
  const token = Cookies.get("userToken") || localStorage.getItem("userToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default UserProtection;
