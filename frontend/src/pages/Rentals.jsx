import { useState } from "react";
import { Plus, Search, Filter, CheckCircle } from "lucide-react";
import mockRentals from "../mocks/reservations.json";
import RentalFormModal from "../components/rental/RentalFormModal";
import mockClients from "../mocks/clients.json";
import mockVehicles from "../mocks/vehicles.json";
import FinishRentalModal from "../components/rental/FinishRentalModal";

import mockInvoices from "../mocks/invoices.json";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    RESERVADO: "bg-blue-100 text-blue-800",
    ALQUILADO: "bg-yellow-100 text-yellow-800",
    INICIADO: "bg-purple-100 text-purple-800",
    FINALIZADO: "bg-green-100 text-green-800",
    CANCELADO: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString("es-AR", options);
};

export default function Rentals() {
  const [rentals, setRentals] = useState(mockRentals);
  const [vehicles, setVehicles] = useState(mockVehicles);

  const [invoices, setInvoices] = useState(mockInvoices);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [rentalToFinish, setRentalToFinish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIVOS");

  const filteredRentals = rentals.filter((r) => {
    const matchesSearch =
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicleName.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === "ACTIVOS") {
      matchesStatus = r.status === "ALQUILADO" || r.status === "INICIADO";
    } else if (statusFilter) {
      matchesStatus = r.status === statusFilter;
    }
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (formData) => {
    const selectedClient = mockClients.find((c) => c.id === formData.clientId);
    const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);

    const newRental = {
      ...formData,
      id: `r${new Date().getTime()}`,
      clientName: selectedClient?.name || "N/A",
      vehicleName:
        `${selectedVehicle?.brand} ${selectedVehicle?.model}` || "N/A",
      total: (selectedVehicle?.pricePerDay || 50) * 3,
    };

    setRentals((prev) => [newRental, ...prev]);
    setIsCreateModalOpen(false);

    setVehicles((prevVehicles) =>
      prevVehicles.map((v) =>
        v.id === formData.vehicleId ? { ...v, estado: "NO_DISPONIBLE" } : v
      )
    );
  };

  const handleOpenFinishModal = (rental) => {
    setRentalToFinish(rental);
    setIsFinishModalOpen(true);
  };

  const handleFinishSubmit = (data) => {
    console.log("Finalizando alquiler y generando factura:", data);
    const rental = rentalToFinish;

    setRentals((prevRentals) =>
      prevRentals.map((r) =>
        r.id === data.rentalId
          ? {
              ...r,
              status: "FINALIZADO",
              kilometraje_fin: data.kilometraje_fin,
            }
          : r
      )
    );

    setVehicles((prevVehicles) =>
      prevVehicles.map((v) =>
        v.id === rental.vehicleId
          ? {
              ...v,
              estado: "DISPONIBLE",
              kilometraje_actual: data.kilometraje_fin,
            }
          : v
      )
    );

    const newInvoice = {
      id: `f${new Date().getTime()}`,
      rentalId: rental.id,
      clientName: rental.clientName,
      issueDate: new Date().toISOString(),
      total: rental.total,
      paymentMethod: data.metodo_pago,
      status: "NO COBRADA",
    };
    setInvoices((prevInvoices) => [newInvoice, ...prevInvoices]);

    setIsFinishModalOpen(false);
    setRentalToFinish(null);
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Alquileres
        </h1>
      </header>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between gap-4 border-b border-gray-200">
          {}
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente o vehículo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVOS">Activos (En Curso)</option>
              <option value="">Todos los estados</option>
              <option value="RESERVADO">Reservado</option>
              <option value="ALQUILADO">Alquilado</option>
              <option value="INICIADO">Iniciado</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 sm:w-auto w-full"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Alquiler Inmediato</span>
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
                  Cliente
                </th>
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
                  Estado
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rental.clientName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rental.vehicleName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      Inicia: {formatDate(rental.startDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Finaliza: {formatDate(rental.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={rental.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {rental.status === "ALQUILADO" ||
                    rental.status === "INICIADO" ? (
                      <button
                        onClick={() => handleOpenFinishModal(rental)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-800"
                        title="Finalizar Alquiler"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Finalizar
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRentals.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron alquileres que coincidan con los filtros.
          </div>
        )}
      </div>

      <RentalFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
      <FinishRentalModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onSubmit={handleFinishSubmit}
        rentalToFinish={rentalToFinish}
      />
    </section>
  );
}
