import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); 
  let api = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`/auth/check`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setIsAuth(true); // user is authenticated
      } catch (err) {
        setIsAuth(true); // user is not authenticated
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <p>Loading...</p>; 
  return isAuth ? children : <Navigate to="/" replace />; // redirect if not logged in
};

export default ProtectedRoute;
