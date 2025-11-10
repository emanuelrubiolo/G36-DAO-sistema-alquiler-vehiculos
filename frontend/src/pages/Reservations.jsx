import { useState } from "react";
import { Plus } from "lucide-react";
import mockReservations from "../mocks/reservations.json";
import ReservationList from "../components/reservation/ReservationList";
import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";
import { Sliders, X, Edit, Trash2, CheckCircle, Eye } from "lucide-react";
import FinishRentalModal from "../components/rental/FinishRentalModal";
import mockVehicles from "../mocks/vehicles.json";
import mockInvoices from "../mocks/invoices.json";
import ReservationFormModal from "../components/reservation/ReservationFormModal";

const StatusBadge = ({ status }) => {
  const statusMap = {
    RESERVADO: { text: "Reservado", color: "bg-indigo-100 text-indigo-800" },
    ALQUILADO: { text: "Alquilado", color: "bg-blue-100 text-blue-800" },
    INICIADO: { text: "En Curso", color: "bg-purple-100 text-purple-800" },
    FINALIZADO: { text: "Finalizado", color: "bg-green-100 text-green-800" },
    CANCELADO: { text: "Cancelado", color: "bg-red-100 text-red-800" },
  };
  const { text, color } = statusMap[status] || {
    text: status,
    color: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${color}`}
    >
      {text}
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

  const handleDelete = (reservationId) => {
    if (window.confirm("¿Estás seguro de que quieres CANCELAR esta reserva?")) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId
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

  return (
    <section className="space-y-6">
      {}
      <header className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Reservas
        </h1>
        {}
        <StyledPrimaryButton onClick={handleNewReservation}>
          <Plus className="w-5 h-5" />
          <span>Nueva Reserva</span>
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
          {}
          <ReservationList
            reservations={filteredReservations}
            onStart={handleStartRental}
            onFinish={handleOpenFinishModal}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
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
