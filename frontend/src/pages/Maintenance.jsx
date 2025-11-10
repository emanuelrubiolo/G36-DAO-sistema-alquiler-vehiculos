import { useState, useEffect } from "react";
import { Plus, Search, Sliders, X, Edit, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import mockMaintenance from "../mocks/maintenance.json";
import MaintenanceFormModal from "../components/maintenance/MaintenanceFormModal";
import mockVehicles from "../mocks/vehicles.json";

import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";
import GenericTable from "../components/ui/GenericTable";
import TableActionCell from "../components/ui/TableActionCell";
import { formatCurrency, formatDate } from "../utils/formatters";

const TypeBadge = ({ type }) => {
  const typeStyles = {
    Preventivo: "bg-blue-100 text-blue-800",
    Correctivo: "bg-red-100 text-red-800",
    "En progreso": "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
        typeStyles[type] || "bg-gray-100 text-gray-800"
      }`}
    >
      {type}
    </span>
  );
};

export default function Maintenance() {
  const location = useLocation();

  const [maintenanceJobs, setMaintenanceJobs] = useState(mockMaintenance);
  const [searchTerm, setSearchTerm] = useState("");
  const [vehiclesList] = useState(mockVehicles);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const [dashboardFilterMessage, setDashboardFilterMessage] = useState(null);

  useEffect(() => {
    if (location.state && location.state.filter === "PENDIENTE") {
      const pendingJobs = mockMaintenance.filter(
        (job) => job.type === "Preventivo" || job.type === "Correctivo"
      );

      setMaintenanceJobs(pendingJobs);
      setDashboardFilterMessage(location.state.message);

      window.history.replaceState({}, document.title, location.pathname);
    } else {
      setMaintenanceJobs(mockMaintenance);
      setDashboardFilterMessage(null);
    }
  }, [location.state]);

  const jobsSource = dashboardFilterMessage ? maintenanceJobs : mockMaintenance;

  const filteredJobs = jobsSource.filter(
    (job) =>
      job.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleFormSubmit = (formData) => {
    if (jobToEdit) {
      setMaintenanceJobs((prev) =>
        prev.map((j) =>
          j.id === jobToEdit.id ? { ...jobToEdit, ...formData } : j
        )
      );
    } else {
      const newJob = { id: `m${new Date().getTime()}`, ...formData };
      setMaintenanceJobs((prev) => [newJob, ...prev]);
    }
    handleCloseModal();
  };

  const handleDelete = (job) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar el registro de ${job.vehicleName}?`
      )
    ) {
      setMaintenanceJobs((prev) => prev.filter((j) => j.id !== job.id));
    }
  };

  const handleClearDashboardFilter = () => {
    setMaintenanceJobs(mockMaintenance);
    setDashboardFilterMessage(null);
    setSearchTerm("");
  };

  const columns = [
    { header: "Vehículo / Descripción", field: "vehicleName" },
    { header: "Período", field: "period" },
    { header: "Tipo", field: "type" },
    { header: "Costo", field: "cost", align: "right" },
  ];

  return (
    <section className="space-y-6">
      {}
      <header className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Mantenimiento
        </h1>
        <StyledPrimaryButton onClick={handleOpenCreateModal}>
          <Plus className="w-5 h-5" />
          <span>Registrar Mantenimiento</span>
        </StyledPrimaryButton>
      </header>

      {}
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

      {}
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

      {}
      <div className="mt-6 flex gap-6">
        {}
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

        {}
        <div className="flex-grow">
          <GenericTable
            columns={columns}
            data={filteredJobs}
            emptyMessage="No se encontraron registros de mantenimiento."
          >
            {(job) => (
              <tr
                key={job.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {job.vehicleName}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">
                    {job.description}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800">
                    Inicia: {formatDate(job.startDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Finaliza: {formatDate(job.endDate)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <TypeBadge type={job.type} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-extrabold text-gray-900">
                    {formatCurrency(job.cost)}
                  </span>
                </td>

                <TableActionCell
                  data={job}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDelete}
                  additionalActionTitle="Ver/Editar"
                  hideDelete={false}
                />
              </tr>
            )}
          </GenericTable>
        </div>
      </div>

      {}
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
