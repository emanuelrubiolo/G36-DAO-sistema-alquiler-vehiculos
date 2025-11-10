import { useState } from "react";
import { Plus, Search, Sliders, X } from "lucide-react";
import mockIncidents from "../mocks/incidents.json";
import IncidentList from "../components/incident/IncidentList";
import IncidentFormModal from "../components/incident/IncidentFormModal";
import mockRentals from "../mocks/reservations.json";
import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";

export default function Incidents() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [rentalsList] = useState(mockRentals);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchExecution = () => {
    console.log("Ejecutando búsqueda de incidentes con:", searchTerm);
  };

  const handleOpenCreateModal = () => {
    setIncidentToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (incident) => {
    setIncidentToEdit(incident);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIncidentToEdit(null);
  };

  const handleFormSubmit = (formData) => {
    if (incidentToEdit) {
      setIncidents((prev) =>
        prev.map((i) =>
          i.id === incidentToEdit.id ? { ...incidentToEdit, ...formData } : i
        )
      );
    } else {
      const newIncident = {
        id: `i${new Date().getTime()}`,
        ...formData,
      };
      setIncidents((prev) => [newIncident, ...prev]);
    }
    handleCloseModal();
  };

  const handleDelete = (incidentId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este incidente?")
    ) {
      setIncidents((prev) => prev.filter((i) => i.id !== incidentId));
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Incidentes
        </h1>
        <StyledPrimaryButton onClick={handleOpenCreateModal}>
          <Plus className="w-5 h-5" />
          <span>Registrar Incidente</span>
        </StyledPrimaryButton>
      </header>

      <div className="flex gap-6">
        <SearchBoxWithButton
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchClick={handleSearchExecution}
          onOpenAdvancedFilters={() => setIsAdvancedFilterOpen((prev) => !prev)}
          view="table"
          showViewToggle={false}
          placeholder="Buscar por Alquiler, Cliente o Descripción..."
        />
      </div>

      <div className="mt-6 flex gap-6">
        {isAdvancedFilterOpen && (
          <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-5 shrink-0 transition-all duration-300">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sliders className="w-5 h-5 text-gray-600" />
                Filtros de Incidente
              </h3>
              <button
                onClick={() => setIsAdvancedFilterOpen(false)}
                className="btn size-8 rounded-full p-0 text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="font-semibold text-gray-700">Tipo:</div>
              <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                (Daño / Multa)
              </div>
            </div>
          </div>
        )}

        {}
        <div className="flex-grow">
          <IncidentList
            incidents={filteredIncidents ?? []}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <IncidentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        incidentToEdit={incidentToEdit}
        rentalsList={rentalsList}
      />
    </section>
  );
}
