import { useState } from "react";
import { Plus, Sliders, X } from "lucide-react";
import mockRentals from "../mocks/reservations.json";
import RentalList from "../components/rental/RentalList";
import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";
import FinishRentalModal from "../components/rental/FinishRentalModal";
import ReservationFormModal from "../components/reservation/ReservationFormModal";
import mockVehicles from "../mocks/vehicles.json";
import mockInvoices from "../mocks/invoices.json";

export default function Rentals() {
  const initialRentals = mockRentals.filter(
    (r) =>
      r.status === "ALQUILADO" ||
      r.status === "INICIADO" ||
      r.status === "FINALIZADO"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [rentals, setRentals] = useState(initialRentals);
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [invoices, setInvoices] = useState(mockInvoices);
  const [view] = useState("table");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [rentalToEdit, setRentalToEdit] = useState(null);

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [rentalToFinish, setRentalToFinish] = useState(null);

  const filteredRentals = rentals.filter((res) => {
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
    console.log("Ejecutando búsqueda de alquileres con:", searchTerm);
  };

  const handleNewRental = () => {
    setRentalToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (rental) => {
    setRentalToEdit(rental);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setRentalToEdit(null);
  };
  const handleEditSubmit = (formData) => {
    if (!rentalToEdit) {
      const newRental = {
        id: `a${new Date().getTime()}`,
        status: "ALQUILADO",
        fecha_confirmacion: new Date().toISOString(),
        ...formData,
      };
      setRentals((prev) => [newRental, ...prev]);
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === formData.vehicleId ? { ...v, estado: "ALQUILADO" } : v
        )
      );
    } else {
      setRentals((prev) =>
        prev.map((r) =>
          r.id === rentalToEdit.id ? { ...rentalToEdit, ...formData } : r
        )
      );
    }
    handleCloseEditModal();
  };

  const handleOpenFinishModal = (rental) => {
    setRentalToFinish(rental);
    setIsFinishModalOpen(true);
  };

  const handleFinishSubmit = (data) => {
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

  const handleDelete = (rentalId) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres CANCELAR este alquiler? Esto no generará factura."
      )
    ) {
      setRentals((prev) =>
        prev.map((r) =>
          r.id === rentalId
            ? {
                ...r,
                status: "CANCELADO",
                fecha_cancelacion: new Date().toISOString(),
              }
            : r
        )
      );

      const rental = rentals.find((r) => r.id === rentalId);
      if (rental) {
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === rental.vehicleId ? { ...v, estado: "DISPONIBLE" } : v
          )
        );
      }
    }
  };

  return (
    <section className="space-y-6">
      {}
      <header className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Alquileres Activos
        </h1>
        {}
        <StyledPrimaryButton onClick={handleNewRental}>
          <Plus className="w-5 h-5" />
          <span>Registrar Alquiler</span>
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
          placeholder="Buscar por Cliente, Vehículo o ID de Alquiler..."
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
                Filtros de Alquiler
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
              <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                (Checkboxes de Estado)
              </div>
            </div>
          </div>
        )}

        {}
        <div className="flex-grow">
          <RentalList
            rentals={filteredRentals}
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
        reservationToEdit={rentalToEdit}
        isRentalCreation={!rentalToEdit}
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
