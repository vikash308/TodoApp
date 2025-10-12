import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:3000/auth/check", {
          withCredentials: true,
        });
        setIsAuth(true); // user is authenticated
      } catch (err) {
        setIsAuth(false); // user is not authenticated
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <p>Loading...</p>; 
  return isAuth ? children : <Navigate to="/" replace />; // redirect if not logged in
};

export default ProtectedRoute;
