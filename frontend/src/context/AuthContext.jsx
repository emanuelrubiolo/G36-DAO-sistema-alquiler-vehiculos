import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api-config";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const item = window.localStorage.getItem("car-doba-user");
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error al leer localStorage", error);
      return null;
    }
  });

  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      // Call the backend API
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });

      // Extract user data from response
      const userData = response.data;

      // Store in localStorage
      window.localStorage.setItem(
        "car-doba-user",
        JSON.stringify(userData)
      );
      
      // Update state
      setCurrentUser(userData);
      
      // Navigate to home
      navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
      
      // Show appropriate error message
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Error al conectar con el servidor. Verifica que el backend esté corriendo.");
      }
    }
  };

  const logout = () => {
    window.localStorage.removeItem("car-doba-user");
    setCurrentUser(null);
    navigate("/login");
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}