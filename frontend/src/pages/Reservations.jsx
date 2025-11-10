import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Sliders,
  X,
  PlayCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import mockReservations from "../mocks/reservations.json";
import mockVehicles from "../mocks/vehicles.json";
import mockInvoices from "../mocks/invoices.json";

import ReservationFormModal from "../components/reservation/ReservationFormModal";
import FinishRentalModal from "../components/rental/FinishRentalModal";
import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";
import GenericTable from "../components/ui/GenericTable";
import TableActionCell from "../components/ui/TableActionCell";

import { formatCurrency, formatDate } from "../utils/formatters";

const StatusBadge = ({ status }) => {
  const statusMap = {
    RESERVADO: { text: "Reservado", color: "bg-indigo-100 text-indigo-800" },
    ALQUILADO: { text: "Alquilado", color: "bg-yellow-100 text-yellow-800" },
    INICIADO: { text: "En Curso", color: "bg-purple-100 text-purple-800" },
    FINALIZADO: { text: "Finalizado", color: "bg-green-100 text-green-800" },
    CANCELADO: { text: "Cancelado", color: "bg-red-100 text-red-800" },
  };
  const { text, color } = statusMap[status] || {
    text: status,
    color: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${color}`}
    >
      {text}
    </span>
  );
};

export default function Reservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState(mockReservations);
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [invoices, setInvoices] = useState(mockInvoices);
  const [view] = useState("table");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState(null);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [rentalToFinish, setRentalToFinish] = useState(null);

  const filteredReservations = reservations.filter((res) => {
    const term = searchTerm.toLowerCase();
    const vehiclePatente =
      mockVehicles.find((v) => v.id === res.vehicleId)?.patente || "";

    return (
      res.clientName.toLowerCase().includes(term) ||
      res.vehicleName.toLowerCase().includes(term) ||
      res.id.toLowerCase().includes(term) ||
      vehiclePatente.toLowerCase().includes(term)
    );
  });

  const handleSearchExecution = () => {
    console.log("Ejecutando búsqueda de reservas con:", searchTerm);
  };

  const handleNewReservation = () => {
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
        r.id === reservation.id
          ? {
              ...r,
              status: "INICIADO",
              fecha_confirmacion: new Date().toISOString(),
            }
          : r
      )
    );
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === reservation.vehicleId ? { ...v, estado: "NO_DISPONIBLE" } : v
      )
    );
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
        v.id === rentalToFinish.vehicleId
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

  const handleDelete = (reservation) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres CANCELAR la reserva ID ${reservation.id}?`
      )
    ) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservation.id
            ? {
                ...r,
                status: "CANCELADO",
                fecha_cancelacion: new Date().toISOString(),
              }
            : r
        )
      );
    }
  };

  const columns = [
    { header: "# Reserva", field: "id" },
    { header: "Cliente / Vehículo", field: "clientVehicle" },
    { header: "Período", field: "period" },
    { header: "Monto Total", field: "total", align: "right" },
    { header: "Estado", field: "status" },
  ];

  return (
    <section className="space-y-6">
      {}
      <header className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Reservas
        </h1>
        <StyledPrimaryButton onClick={handleNewReservation}>
          <Plus className="w-5 h-5" />
          <span>Registrar Reserva</span>
        </StyledPrimaryButton>
      </header>

      {}
      <div className="flex gap-6">
        <SearchBoxWithButton
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchClick={handleSearchExecution}
          onOpenAdvancedFilters={() => setIsAdvancedFilterOpen((prev) => !prev)}
          view={view}
          showViewToggle={false}
          placeholder="Buscar por Cliente, Vehículo o ID de Reserva..."
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
                Filtros de Reserva
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
                Estado de la Reserva:
              </div>
              <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                (Checkboxes de Estado)
              </div>
            </div>
          </div>
        )}

        {}
        <div className="flex-grow">
          <GenericTable
            columns={columns}
            data={filteredReservations}
            emptyMessage="No se encontraron reservas que coincidan con los filtros."
          >
            {(res) => (
              <tr
                key={res.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {res.id}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {res.clientName}
                  </div>
                  <div className="text-xs text-gray-500">{res.vehicleName}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800">
                    Inicia: {formatDate(res.startDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Finaliza: {formatDate(res.endDate)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-extrabold text-gray-900">
                    {formatCurrency(res.total)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={res.status} />
                </td>

                {}
                <TableActionCell
                  data={res}
                  onAction={
                    res.status === "RESERVADO"
                      ? handleStartRental
                      : res.status === "ALQUILADO" || res.status === "INICIADO"
                      ? handleOpenFinishModal
                      : null
                  }
                  additionalActionIcon={
                    res.status === "RESERVADO"
                      ? PlayCircle
                      : res.status === "ALQUILADO" || res.status === "INICIADO"
                      ? CheckCircle
                      : null
                  }
                  additionalActionTitle={
                    res.status === "RESERVADO"
                      ? "Iniciar Alquiler"
                      : res.status === "ALQUILADO" || res.status === "INICIADO"
                      ? "Finalizar Alquiler"
                      : null
                  }
                  onEdit={
                    res.status === "RESERVADO" ? handleOpenEditModal : null
                  }
                  onDelete={res.status !== "FINALIZADO" ? handleDelete : null}
                />
              </tr>
            )}
          </GenericTable>
        </div>
      </div>

      {}
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
