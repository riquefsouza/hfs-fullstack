import React from "react";
//import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const isAuthenticated = useSelector(selectIsAuthenticated);
  // if (!isAuthenticated) {
  //   return <Navigate to="/" />;
  // }

  return <>{children}</>;
};
