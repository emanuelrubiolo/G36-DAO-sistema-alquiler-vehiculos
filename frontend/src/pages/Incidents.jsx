import { useState } from "react";
import { Search, Plus, Edit, AlertCircle } from "lucide-react";
import mockIncidents from "../mocks/incidents.json";

import mockRentals from "../mocks/reservations.json";

import IncidentFormModal from "../components/incident/IncidentFormModal";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("es-AR", options);
};

const TypeBadge = ({ type }) => {
  const isDamage = type === "Daño";
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
        isDamage ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {type}
    </span>
  );
};

export default function Incidents() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState(null);

  const [rentalsList, setRentalsList] = useState(mockRentals);

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Incidentes
        </h1>
      </header>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between gap-4 border-b border-gray-200">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, vehículo o descripción..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Incidente</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Alquiler / Cliente
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Vehículo / Descripción
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Costo
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {incident.clientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Alquiler ID: {incident.rentalId}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrawrap">
                    <div className="text-sm font-medium text-gray-900">
                      {incident.vehicleName}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {incident.description}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <TypeBadge type={incident.type} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ${incident.cost}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={() => handleOpenEditModal(incident)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modificar/Ver Detalles"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredIncidents.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron incidentes.
          </div>
        )}
      </div>

      {}
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
