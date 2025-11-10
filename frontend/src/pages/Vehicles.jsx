import { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import mockVehicles from "../mocks/vehicles.json";
import VehicleFormModal from "../components/vehicle/VehicleFormModal";

const VehicleStatusBadge = ({ status }) => {
  const statusStyles = {
    DISPONIBLE: "bg-green-100 text-green-800",
    EN_MANTENIMIENTO: "bg-yellow-100 text-yellow-800",
    NO_DISPONIBLE: "bg-red-100 text-red-800",
  };
  const text = {
    DISPONIBLE: "Disponible",
    EN_MANTENIMIENTO: "En Mantenimiento",
    NO_DISPONIBLE: "No Disponible",
  };
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {text[status] || "Desconocido"}
    </span>
  );
};

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState(mockVehicles);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.patente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setVehicleToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVehicleToEdit(null);
  };

  const handleFormSubmit = (formData) => {
    if (vehicleToEdit) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleToEdit.id ? { ...vehicleToEdit, ...formData } : v
        )
      );
    } else {
      const newVehicle = {
        id: `v${new Date().getTime()}`,
        ...formData,
      };
      setVehicles((prev) => [newVehicle, ...prev]);
    }
    handleCloseModal();
  };

  const handleDeleteVehicle = (vehicleId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este vehículo?")
    ) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Vehículos
        </h1>
      </header>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-200">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por marca, modelo o patente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Vehículo</span>
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
                  Patente
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Kilometraje
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Precio /día
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-16 h-10 object-cover rounded-md bg-gray-200"
                        src={
                          vehicle.thumbnail ||
                          "https://via.placeholder.com/150x100?text=Sin+Imagen"
                        }
                        alt={`${vehicle.brand} ${vehicle.model}`}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.brand} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.year}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {vehicle.patente}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <VehicleStatusBadge status={vehicle.estado} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-800">
                      {vehicle.kilometraje_actual.toLocaleString("es-AR")} km
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ${vehicle.pricePerDay}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={() => handleOpenEditModal(vehicle)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modificar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVehicles.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron vehículos que coincidan con la búsqueda.
          </div>
        )}
      </div>

      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        vehicleToEdit={vehicleToEdit}
      />
    </section>
  );
}
