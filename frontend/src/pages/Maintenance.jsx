import { useState } from "react";
import { Plus, Search } from "lucide-react";
import mockMaintenance from "../mocks/maintenance.json";
import MaintenanceList from "../components/maintenance/MaintenanceList";
import MaintenanceFormModal from "../components/maintenance/MaintenanceFormModal";
import mockVehicles from "../mocks/vehicles.json";
import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";

export default function Maintenance() {
  const [maintenanceJobs, setMaintenanceJobs] = useState(mockMaintenance);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const filteredJobs = maintenanceJobs.filter(
    (job) =>
      job.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      const newJob = {
        id: `m${new Date().getTime()}`,
        ...formData,
      };
      setMaintenanceJobs((prev) => [newJob, ...prev]);
    }
    handleCloseModal();
  };

  const handleDelete = (jobId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este registro?")
    ) {
      setMaintenanceJobs((prev) => prev.filter((job) => job.id !== jobId));
    }
  };

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
      <div className="flex gap-6">
        <SearchBoxWithButton
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchClick={() => console.log("Searching Maint...")}
          onOpenAdvancedFilters={() => {}}
          view="table"
          showViewToggle={false}
          placeholder="Buscar por Vehículo o Descripción..."
        />
      </div>

      {}
      <div className="mt-6 flex-grow">
        <MaintenanceList
          maintenanceJobs={filteredJobs}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      <MaintenanceFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        jobToEdit={jobToEdit}
        vehiclesList={mockVehicles}
      />
    </section>
  );
}
