import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

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
        setIsAuth(true); // user is authenticated
      } catch (err) {
        setIsAuth(false); // user is not authenticated
      }
    };
    checkAuth();
  }, []);

  return isAuth ? children : <Navigate to="/login" replace />; // redirect if not logged in
};

export default ProtectedRoute;
