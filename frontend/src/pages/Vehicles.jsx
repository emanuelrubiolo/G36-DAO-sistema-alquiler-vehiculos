import { useState, useEffect } from "react";
import { Search, LayoutGrid, List, Sliders, X, Plus } from "lucide-react"; // Agregado Plus
import { vehicleService } from "../services";
import VehicleList from "../components/vehicle/VehicleList";
import VehicleFormModal from "../components/vehicle/VehicleFormModal"; // Importar el Modal
import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton"; // Importar botón primario

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

  // Estados para el modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAll();

      // Filtramos para excluir los que tienen estado "baja"
      const activeVehicles = Array.isArray(data)
        ? data.filter((v) => v.estado?.toLowerCase() !== "baja")
        : [];

      setVehicles(activeVehicles);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      alert("Error al cargar vehículos");
      setVehicles([]);
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

  // Manejadores del Modal
  const handleOpenCreateModal = () => {
    setVehicleToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setVehicleToEdit(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (vehicleToEdit) {
        // Lógica de edición (si fuera necesaria en el futuro)
        await vehicleService.update(vehicleToEdit.id, formData);
        alert("Vehículo actualizado exitosamente");
      } else {
        // Lógica de creación
        await vehicleService.create(formData);
        alert("Vehículo creado exitosamente");
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      const errorMsg =
        error.response?.data?.detail || "Error al guardar el vehículo";
      alert(errorMsg);
    }
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
          Gestión de Vehículos
        </h1>
        {/* Botón Agregar Vehículo */}
        <StyledPrimaryButton onClick={handleOpenCreateModal}>
          <Plus className="w-5 h-5" />
          <span>Nuevo Vehículo</span>
        </StyledPrimaryButton>
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

      {/* Modal de Formulario */}
      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        vehicleToEdit={vehicleToEdit}
      />
    </section>
  );
}
