import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log("userrr", user);
  // console.log("Role", user.data.user.role);
  if (!user) {
    return <Navigate to="/Login" />;
  }
  return children;
};

export default PrivateRoute;
