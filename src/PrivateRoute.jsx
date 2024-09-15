import React, { useState, useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
import { supabase } from "./DataBase/Client"; // Asegúrate de que la ruta es correcta

const PrivateRoute = ({ element: Component, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Puedes usar un indicador de carga aquí
  }

  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
