import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import mockReservations from "../mocks/reservations.json";
import ReservationFormModal from "../components/reservation/ReservationFormModal";
import FinishRentalModal from "../components/rental/FinishRentalModal";
import mockVehicles from "../mocks/vehicles.json";
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

export default function Reservations() {
  const [reservations, setReservations] = useState(mockReservations);
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [invoices, setInvoices] = useState(mockInvoices);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState(null);

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [rentalToFinish, setRentalToFinish] = useState(null);

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.vehicleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? res.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setReservationToEdit(null);
    setIsEditModalOpen(true);
  };
  const handleOpenEditModal = (reservation) => {
    setReservationToEdit(reservation);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setReservationToEdit(null);
  };
  const handleEditSubmit = (formData) => {
    if (reservationToEdit) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationToEdit.id
            ? { ...reservationToEdit, ...formData }
            : r
        )
      );
    } else {
      const newReservation = { id: `r${new Date().getTime()}`, ...formData };
      setReservations((prev) => [newReservation, ...prev]);
    }
    handleCloseEditModal();
  };

  const handleOpenFinishModal = (rental) => {
    setRentalToFinish(rental);
    setIsFinishModalOpen(true);
  };

  const handleFinishSubmit = (data) => {
    const rental = rentalToFinish;
    setReservations((prevRentals) =>
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

  const handleDelete = (reservationId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    }
  };

  const handleStartRental = (reservation) => {
    if (
      !window.confirm(
        `¿Iniciar el alquiler para ${reservation.clientName} con el ${reservation.vehicleName}?`
      )
    ) {
      return;
    }

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservation.id ? { ...r, status: "INICIADO" } : r
      )
    );

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === reservation.vehicleId ? { ...v, estado: "NO_DISPONIBLE" } : v
      )
    );

    console.log("Alquiler iniciado:", reservation.id);
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Reservas
        </h1>
      </header>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between gap-4 border-b border-gray-200">
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
              <option value="">Todos los estados</option>
              <option value="RESERVADO">Reservado</option>
              <option value="ALQUILADO">Alquilado</option>
              <option value="INICIADO">Iniciado</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 sm:w-auto w-full"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Reserva</span>
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
                  Total
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
              {filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {res.clientName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {res.vehicleName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      Inicia: {formatDate(res.startDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Finaliza: {formatDate(res.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${res.total}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={res.status} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      {res.status === "ALQUILADO" ||
                      res.status === "INICIADO" ? (
                        <button
                          onClick={() => handleOpenFinishModal(res)}
                          className="text-green-600 hover:text-green-800"
                          title="Finalizar Alquiler"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      ) : null}

                      {res.status === "RESERVADO" ? (
                        <button
                          onClick={() => handleStartRental(res)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Iniciar Alquiler"
                        >
                          <PlayCircle className="w-5 h-5" />
                        </button>
                      ) : null}

                      {res.status === "RESERVADO" ||
                      res.status === "CANCELADO" ? (
                        <button
                          onClick={() => handleOpenEditModal(res)}
                          className="text-gray-500 hover:text-gray-800"
                          title="Modificar/Ver Detalles"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      ) : null}

                      {res.status !== "FINALIZADO" ? (
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar/Cancelar Reserva"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron reservas que coincidan con los filtros.
          </div>
        )}
      </div>

      <ReservationFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        reservationToEdit={reservationToEdit}
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
