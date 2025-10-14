import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API_URL}/auth/check`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ MUST return while loading
  if (isAuth === null) return <Loading/>

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
