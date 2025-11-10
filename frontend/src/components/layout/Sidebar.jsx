import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  ClipboardList,
  Wrench,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Briefcase,
  Key,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Vehículos", icon: Car, path: "/vehiculos" },
  { name: "Reservas", icon: CalendarCheck, path: "/reservas" },
  { name: "Clientes", icon: Users, path: "/clientes" },
  { name: "Alquileres", icon: ClipboardList, path: "/alquileres" },
  { name: "Mantenimiento", icon: Wrench, path: "/mantenimiento" },
  { name: "Incidentes", icon: AlertTriangle, path: "/incidentes" },
  { name: "Facturación", icon: DollarSign, path: "/facturacion" },
  { name: "Reportes", icon: BarChart3, path: "/reportes" },
  { name: "Empleados", icon: Briefcase, path: "/empleados" },
  { name: "Usuarios", icon: Key, path: "/usuarios" },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <span className="text-2xl">🚗</span>
        <h1 className="font-semibold text-gray-800 text-lg">RentApp</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {currentUser.name ? currentUser.name.charAt(0) : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {currentUser.name || "Usuario"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.cargo || "Empleado"}
              </p>
            </div>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-600 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-500 text-center">
            Iniciando sesión...
          </p>
        )}
      </div>
    </aside>
  );
}
