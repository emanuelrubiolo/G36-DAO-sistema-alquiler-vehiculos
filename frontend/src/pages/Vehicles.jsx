import { useState, useEffect } from "react";

import { Search, LayoutGrid, List, Sliders, X } from "lucide-react";
import { vehicleService } from "../services";
import VehicleList from "../components/vehicle/VehicleList";
import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";

const getToggleClasses = (currentView, buttonView) => {
  return `p-2 rounded-lg transition-all duration-200 ${
    currentView === buttonView
      ? "bg-blue-100 text-blue-600 shadow-sm"
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
  }`;
};

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      alert("Error al cargar vehículos");
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.brand?.toLowerCase().includes(term) ||
      v.model?.toLowerCase().includes(term) ||
      v.patente?.toLowerCase().includes(term)
    );
  });

  const handleSearchExecution = () => {
    console.log("Ejecutando búsqueda profunda con:", searchTerm);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion de vehiculos
        </h1>
      </header>

      <div className="flex gap-6">
        <SearchBoxWithButton
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchClick={handleSearchExecution}
          onOpenAdvancedFilters={() => setIsAdvancedFilterOpen((prev) => !prev)}
          view={view}
          onViewChange={setView}
          showViewToggle={true}
          placeholder="Ubicación, Marca o Patente..."
        />
      </div>

      <div className="mt-6 flex gap-6">
        {isAdvancedFilterOpen && (
          <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-5 shrink-0 transition-all duration-300">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sliders className="w-5 h-5 text-gray-600" />
                Filtros Avanzados
              </h3>
              <button
                onClick={() => setIsAdvancedFilterOpen(false)}
                className="btn size-8 rounded-full p-0 text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="font-semibold text-gray-700">
                Rango de Precios:
              </div>
              <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                (Slider Mock aquí)
              </div>
              <div className="font-semibold text-gray-700">
                Tipo de Combustible:
              </div>
              <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                (Checkboxes Mock aquí)
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow">
          <VehicleList vehicles={filteredVehicles} view={view} />
        </div>
      </div>
    </section>
  );
}
