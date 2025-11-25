import { useState, useEffect } from "react";
import { Plus, Sliders, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { maintenanceService, vehicleService } from "../services";

import MaintenanceFormModal from "../components/maintenance/MaintenanceFormModal";
import MaintenanceList from "../components/maintenance/MaintenanceList"; // Importamos el componente correcto

import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";

export default function Maintenance() {
  const location = useLocation();

  const [maintenanceJobs, setMaintenanceJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [vehiclesList, setVehiclesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const [dashboardFilterMessage, setDashboardFilterMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (
      location.state &&
      location.state.filter === "PENDIENTE" &&
      allJobs.length > 0
    ) {
      const pendingJobs = allJobs.filter(
        (job) => job.type === "Preventivo" || job.type === "Correctivo"
      );

      setMaintenanceJobs(pendingJobs);
      setDashboardFilterMessage(location.state.message);

      window.history.replaceState({}, document.title, location.pathname);
    } else if (allJobs.length > 0) {
      setMaintenanceJobs(allJobs);
      setDashboardFilterMessage(null);
    }
  }, [location.state, allJobs]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsData, vehiclesData] = await Promise.all([
        maintenanceService.getAll(),
        vehicleService.getAll(),
      ]);
      setAllJobs(jobsData);
      setMaintenanceJobs(jobsData);
      setVehiclesList(vehiclesData);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const jobsSource = dashboardFilterMessage ? maintenanceJobs : allJobs;

  const filteredJobs = jobsSource.filter(
    (job) =>
      job.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchExecution = () => {
    console.log("Ejecutando búsqueda de mantenimiento con:", searchTerm);
  };

  const handleOpenCreateModal = () => {
    setJobToEdit(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setJobToEdit(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (jobToEdit) {
        // Si el usuario marcó como finalizado en el form, el form ya lo envía en el payload
        // pero aquí usamos el update genérico o finish según corresponda.
        // Para simplificar, usamos update ya que el modal maneja la lógica de campos.
        await maintenanceService.update(jobToEdit.id, formData);
        alert("Mantenimiento actualizado exitosamente");
      } else {
        await maintenanceService.create(formData);
        alert("Mantenimiento registrado exitosamente");
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg =
        error.response?.data?.detail || "Error al guardar el mantenimiento";
      alert(errorMsg);
    }
  };

  const handleDelete = async (jobId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este registro?")
    ) {
      try {
        await maintenanceService.delete(jobId);
        alert("Mantenimiento eliminado exitosamente");
        await loadData();
      } catch (error) {
        console.error("Error deleting maintenance:", error);
        const errorMsg =
          error.response?.data?.detail || "Error al eliminar el mantenimiento";
        alert(errorMsg);
      }
    }
  };

  const handleClearDashboardFilter = async () => {
    await loadData();
    setDashboardFilterMessage(null);
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mantenimientos...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Mantenimiento
        </h1>
        <StyledPrimaryButton onClick={handleOpenCreateModal}>
          <Plus className="w-5 h-5" />
          <span>Registrar Mantenimiento</span>
        </StyledPrimaryButton>
      </header>

      {dashboardFilterMessage && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md shadow-md flex justify-between items-center">
          <p className="font-semibold text-yellow-800">
            {dashboardFilterMessage}
          </p>
          <button
            onClick={handleClearDashboardFilter}
            className="text-yellow-800 hover:text-yellow-900 font-bold flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" />
            Mostrar Todos
          </button>
        </div>
      )}

      <div className="flex gap-6">
        <SearchBoxWithButton
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchClick={handleSearchExecution}
          onOpenAdvancedFilters={() => setIsAdvancedFilterOpen((prev) => !prev)}
          view="table"
          showViewToggle={false}
          placeholder="Buscar por Vehículo o Descripción..."
        />
      </div>

      <div className="mt-6 flex gap-6">
        {isAdvancedFilterOpen && (
          <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-5 shrink-0 transition-all duration-300">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sliders className="w-5 h-5 text-gray-600" />
                Filtros de Mantenimiento
              </h3>
              <button
                onClick={() => setIsAdvancedFilterOpen(false)}
                className="btn size-8 rounded-full p-0 text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="font-semibold text-gray-700">Estado:</div>
              <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                (Dropdown de Estado Mock)
              </div>
            </div>
          </div>
        )}

        {/* Reemplazo de GenericTable por MaintenanceList */}
        <div className="flex-grow">
          <MaintenanceList
            maintenanceJobs={filteredJobs}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <MaintenanceFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        jobToEdit={jobToEdit}
        vehiclesList={vehiclesList}
      />
    </section>
  );
}
