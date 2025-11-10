import { DollarSign, ClipboardList, Users, Car } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import dashboardData from "../mocks/dashboardData.json";
function KpiCard({ title, value, icon: Icon, unit = "" }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">
          {unit}
          {value.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}

function MonthlyRevenueChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm col-span-1 lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Facturación Mensual
      </h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
            <YAxis
              fontSize={12}
              stroke="#6b7280"
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              formatter={(val) => [`$${val.toLocaleString("es-AR")}`, "Total"]}
            />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar
              dataKey="total"
              name="Facturación"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PopularVehiclesChart({ data }) {
  const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm col-span-1">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vehículos Más Alquilados
      </h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="rentals"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={(entry) => `${entry.name} (${entry.rentals})`}
              labelLine={false}
              fontSize={12}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(val) => [val, "Alquileres"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Home() {
  const { kpis, monthlyRevenue, popularVehicles } = dashboardData;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600">
          Resumen de la actividad de RentApp.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Facturación Total"
          value={kpis.totalRevenue}
          icon={DollarSign}
          unit="$"
        />
        <KpiCard
          title="Alquileres Totales"
          value={kpis.totalRentals}
          icon={ClipboardList}
        />
        <KpiCard
          title="Clientes Activos"
          value={kpis.activeClients}
          icon={Users}
        />
        <KpiCard
          title="Vehículos Disponibles"
          value={kpis.availableVehicles}
          icon={Car}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyRevenueChart data={monthlyRevenue} />
        <PopularVehiclesChart data={popularVehicles} />
      </div>
    </section>
  );
}
