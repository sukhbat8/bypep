import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const PrivateRoutes = ({ children }) => {
  const { authData } = useContext(AuthContext);

  let location = useLocation();

  if (!authData.auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoutes;
