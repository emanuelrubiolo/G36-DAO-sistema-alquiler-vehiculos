import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import mockUsers from "../mocks/users.json";
import mockEmployees from "../mocks/employees.json";

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

  const login = (username, password) => {
    const user = mockUsers.find((u) => u.username === username);

    if (user) {
      const employeeData = mockEmployees.find((e) => e.id === user.employeeId);

      if (employeeData) {
        window.localStorage.setItem(
          "car-doba-user",
          JSON.stringify(employeeData)
        );
        setCurrentUser(employeeData);
        navigate("/");
      } else {
        alert("Error: Usuario encontrado pero no hay datos de empleado.");
      }
    } else {
      alert("Usuario o contraseña incorrectos.");
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
