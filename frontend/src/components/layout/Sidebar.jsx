import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Key, Briefcase, Mail, Phone, Hash, Car } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  ClipboardList,
  Wrench,
  AlertTriangle,
  DollarSign,
  BarChart3,
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
  { name: "Empleados", icon: Briefcase, path: "/empleados" },
  { name: "Usuarios", icon: Key, path: "/usuarios" },
];

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 py-1.5 px-4">
    <div className="text-gray-400">
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const employeeName = currentUser?.name || "Usuario";
  const employeeDNI = currentUser?.dni || "N/A";
  const employeeCargo = currentUser?.cargo || "Empleado";
  const employeeEmail = currentUser?.email || "N/A";
  const employeePhone = currentUser?.phone || "N/A";
  const employeeInitials = employeeName.charAt(0);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {}
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
        <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
          <Car className="w-4 h-4" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text">
          RentApp
        </h1>
      </div>

      {}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{name}</span>
          </NavLink>
        ))}
      </nav>

      {}
      <div className="p-4 border-t border-gray-200 relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex w-full items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-base">
            {employeeInitials}
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {employeeName}
            </p>
            <p className="text-xs text-gray-500 truncate">{employeeCargo}</p>
          </div>
        </button>

        {}
        {isProfileOpen && (
          <div
            className="absolute left-full bottom-0 ml-3 mb-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-bold text-lg text-gray-800">
                {employeeName}
              </h4>
            </div>

            <div className="py-2">
              <DetailRow icon={Briefcase} label="Cargo" value={employeeCargo} />
              <DetailRow icon={Hash} label="DNI" value={employeeDNI} />
              <DetailRow icon={Mail} label="Email" value={employeeEmail} />
              <DetailRow icon={Phone} label="Teléfono" value={employeePhone} />
            </div>

            {}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={logout}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
