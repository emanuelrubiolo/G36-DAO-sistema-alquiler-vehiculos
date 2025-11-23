import React, { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, ClipboardList, Users, Car, Filter, X, RefreshCw } from "lucide-react";

import KpiCard from "../components/dashboard/KpiCard";
import MonthlyRevenueChart from "../components/dashboard/MonthlyRevenueChart";
import MaintenanceAlertWidget from "../components/dashboard/MaintenanceAlertWidget";
import FleetAvailabilityRadialChart from "../components/dashboard/FleetAvailabilityRadialChart";
import PopularVehiclesChart from "../components/dashboard/PopularVehiclesChart";
import QuarterlyRentalsChart from "../components/dashboard/QuarterlyRentalsChart";
import InventoryBarChart from "../components/dashboard/InventoryBarChart";
import ReportsTable from "../components/dashboard/ReportsTable";

const filterDataByYear = (data, year) => {
  if (year === "2025") {
    return data.map((item) => ({ ...item, total: item.total * 1.15 }));
  }
  return data;
};

export default function Home() {
  // Estado para los datos
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedYear, setSelectedYear] = useState("2024");
  const [detailView, setDetailView] = useState(null);
  const [masterVehicleFilter, setMasterVehicleFilter] = useState("");
  const [monthRangeFilter, setMonthRangeFilter] = useState(null);

  // Función para cargar datos
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/dashboard/');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Mientras carga, mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">No hay datos disponibles</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { kpis, monthlyRevenue, popularVehicles, detailedRentals } = dashboardData;

  const filteredRevenue = filterDataByYear(monthlyRevenue, selectedYear);

  const handleRevenueClick = (data) => {
    const month = data.month;
    setDetailView(`Detalle de Facturación para ${month} ${selectedYear}`);
    setMasterVehicleFilter("");
    setMonthRangeFilter(null);
    console.log(`Abriendo detalle para ${month}...`);
  };

  const handleVehicleClick = (data) => {
    const vehicleName = data.name;
    const newFilter = masterVehicleFilter === vehicleName ? "" : vehicleName;
    setMasterVehicleFilter(newFilter);
    setMonthRangeFilter(null);
    setDetailView(null);
    console.log(`Filtro de vehículo aplicado: ${newFilter}`);
  };

  const handleRangeSelection = (startMonth, endMonth) => {
    setMonthRangeFilter({ start: startMonth, end: endMonth });
    setDetailView(null);
    setMasterVehicleFilter("");
    console.log(`Rango de meses seleccionado: ${startMonth} a ${endMonth}`);
  };

  const clearMonthRangeFilter = () => setMonthRangeFilter(null);

  return (
    <section className="space-y-8 p-6">
      {/* Header */}
      <header className="flex justify-between items-center pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Dashboard de Gestión
          </h1>
          <p className="text-base text-gray-600">
            Resumen ejecutivo y métricas críticas de RentApp.
          </p>
        </div>

        {/* Filtros y botón de actualizar */}
        <div className="flex items-center space-x-4">
          {/* Botón de actualizar */}
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            title="Actualizar datos"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>

          {/* Selector de año */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setDetailView(null);
              }}
              className="p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2025">Año 2025 (Proyectado)</option>
              <option value="2024">Año 2024 (Actual)</option>
              <option value="2023">Año 2023 (Histórico)</option>
            </select>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Facturación Total"
          value={kpis.totalRevenue}
          icon={DollarSign}
          unit="$"
          color="bg-green-600"
        />
        <KpiCard
          title="Alquileres Totales"
          value={kpis.totalRentals}
          icon={ClipboardList}
          color="bg-indigo-600"
        />
        <KpiCard
          title="Clientes Activos"
          value={kpis.activeClients}
          icon={Users}
          color="bg-yellow-600"
        />
        <KpiCard
          title="Vehículos Disponibles"
          value={kpis.availableVehicles}
          icon={Car}
          color="bg-red-600"
        />
      </div>

      {/* Alerta de filtro de rango de meses */}
      {monthRangeFilter && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md shadow-md flex justify-between items-center transition-all duration-300">
          <p className="font-semibold text-orange-800">
            Filtro de Rango de Meses Activo: **{monthRangeFilter.start}** a **
            {monthRangeFilter.end}** (Se aplicará a la tabla de reportes).
          </p>
          <button
            onClick={clearMonthRangeFilter}
            className="text-orange-600 hover:text-orange-800 font-bold flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Limpiar Rango
          </button>
        </div>
      )}

      {/* Vista de detalle */}
      {detailView && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md shadow-md">
          <p className="font-semibold text-blue-800">{detailView}</p>
          <p className="text-sm text-blue-600">
            Aquí se cargaría una tabla o un informe específico con las
            transacciones del mes. (Simulación de Drill-Down)
          </p>
        </div>
      )}

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Gráfico de facturación mensual */}
        <div className="lg:col-span-3">
          <MonthlyRevenueChart
            data={filteredRevenue}
            onDataPointClick={handleRevenueClick}
            onRangeSelected={handleRangeSelection}
            currentMonthRange={monthRangeFilter}
          />
        </div>

        {/* Widget de alertas de mantenimiento */}
        <MaintenanceAlertWidget />
      </div>

      {/* Gráficos secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Disponibilidad de flota */}
        <FleetAvailabilityRadialChart kpis={kpis} />

        {/* Vehículos populares */}
        <PopularVehiclesChart
          data={popularVehicles}
          onSegmentClick={handleVehicleClick}
          activeSegment={masterVehicleFilter}
        />

        {/* Alquileres trimestrales */}
        <QuarterlyRentalsChart data={monthlyRevenue} />

        {/* Inventario */}
        <InventoryBarChart />
      </div>

      {/* Tabla de reportes */}
      <div className="grid grid-cols-1 gap-6">
        <ReportsTable
          rentalsData={detailedRentals}
          crossFilterVehicle={masterVehicleFilter}
          monthRangeFilter={monthRangeFilter}
          onClearVehicleFilter={() => setMasterVehicleFilter("")}
          onClearMonthRangeFilter={clearMonthRangeFilter}
        />
      </div>
    </section>
  );
}
