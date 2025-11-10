import { useState } from "react";
import { Search, Plus, Edit, Wrench } from "lucide-react";
import mockMaintenance from "../mocks/maintenance.json";

import mockVehicles from "../mocks/vehicles.json";

import MaintenanceFormModal from "../components/maintenance/MaintenanceFormModal";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("es-AR", options);
};

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
  const [maintenanceJobs, setMaintenanceJobs] = useState(mockMaintenance);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const [vehiclesList, setVehiclesList] = useState(mockVehicles);

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

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Mantenimiento
        </h1>
      </header>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between gap-4 border-b border-gray-200">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por vehículo o descripción..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Mantenimiento</span>
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
                  Vehículo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Período
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
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {job.vehicleName}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
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

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ${job.cost}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={() => handleOpenEditModal(job)}
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

        {filteredJobs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron registros de mantenimiento.
          </div>
        )}
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
