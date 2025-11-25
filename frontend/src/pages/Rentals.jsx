import { useState, useEffect } from "react";

import {

  Plus,

  Search,

  Sliders,

  X,

  PlayCircle,

  CheckCircle,

} from "lucide-react";

import { leaseService, vehicleService, invoiceService, clientService } from "../services";



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



export default function Rentals() {

  const [searchTerm, setSearchTerm] = useState("");

  const [rentals, setRentals] = useState([]);

  const [vehicles, setVehicles] = useState([]);

  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);



  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [rentalToEdit, setRentalToEdit] = useState(null);

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const [rentalToFinish, setRentalToFinish] = useState(null);



  useEffect(() => {

    loadData();

  }, []);



  const loadData = async () => {

    try {

      setLoading(true);

      const [allLeases, vehiclesData, invoicesData] = await Promise.all([

        //todo: clientService.getAll(),

        leaseService.getAll(),

        vehicleService.getAll(),

        invoiceService.getAll()

      ]);

      const activeRentals = allLeases.filter((r) => r.status !== "RESERVADO");

      setRentals(activeRentals);

      setVehicles(vehiclesData);

      setInvoices(invoicesData);

    } catch (error) {

      console.error("Error loading data:", error);

      alert("Error al cargar datos");

    } finally {

      setLoading(false);

    }

  };



  const filteredRentals = rentals.filter((res) => {

    const term = searchTerm.toLowerCase();

    const vehiclePatente =

      vehicles.find((v) => v.id === res.vehicleId)?.patente || "";



    return (

      res.clientName?.toLowerCase().includes(term) ||

      res.vehicleName?.toLowerCase().includes(term) ||

      res.id?.toLowerCase().includes(term) ||

      vehiclePatente.toLowerCase().includes(term)

    );

  });



  const handleSearchExecution = () => {

    console.log("Ejecutando bÃºsqueda de alquileres con:", searchTerm);

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

  const handleEditSubmit = async (formData) => {

    try {

      if (!rentalToEdit) {

        await leaseService.create({

          ...formData,

          status: "ALQUILADO",

          fecha_confirmacion: new Date().toISOString(),

        });

        alert("Alquiler creado exitosamente");

      } else {

        await leaseService.update(rentalToEdit.id, formData);

        alert("Alquiler actualizado exitosamente");

      }

      await loadData();

      handleCloseEditModal();

    } catch (error) {

      console.error("Error submitting form:", error);

      const errorMsg = error.response?.data?.detail || "Error al guardar el alquiler";

      alert(errorMsg);

    }

  };



  const handleOpenFinishModal = (rental) => {

    setRentalToFinish(rental);

    setIsFinishModalOpen(true);

  };



  const handleFinishSubmit = async (data) => {

    try {

      await leaseService.finish(data.rentalId, {

        kilometraje_fin: data.kilometraje_fin,

        metodo_pago: data.metodo_pago

      });

      alert("Alquiler finalizado exitosamente");

      await loadData();

      setIsFinishModalOpen(false);

      setRentalToFinish(null);

    } catch (error) {

      console.error("Error finishing rental:", error);

      alert(error.response?.data?.detail || "Error al finalizar el alquiler");

    }

  };



  const handleDelete = async (rental) => {

    if (

      window.confirm(

        `Â¿EstÃ¡s seguro de que quieres CANCELAR el alquiler ID ${rental}?`

      )

    ) {

      try {

        await leaseService.delete(rental);

        alert("Alquiler cancelado exitosamente");

        await loadData();

      } catch (error) {

        console.error("Error canceling rental:", error);

        alert(error.response?.data?.detail || "Error al cancelar el alquiler");

      }

    }

  };



  if (loading) {

    return (

      <div className="flex items-center justify-center h-screen">

        <div className="text-center">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>

          <p className="mt-4 text-gray-600">Cargando alquileres...</p>

        </div>

      </div>

    );

  }



  const columns = [

    { header: "# Alquiler", field: "id" },

    { header: "Cliente / VehÃ­culo", field: "clientVehicle" },

    { header: "PerÃ­odo", field: "period" },

    { header: "Monto Total", field: "total", align: "right" },

    { header: "Estado", field: "status" },

  ];



  return (

    <section className="space-y-6">

      <header className="flex justify-between items-center pb-2">

        <h1 className="text-3xl font-bold text-gray-900">

          GestiÃ³n de Alquileres Activos

        </h1>

        <StyledPrimaryButton onClick={handleNewRental}>

          <Plus className="w-5 h-5" />

          <span>Registrar Alquiler</span>

        </StyledPrimaryButton>

      </header>



      <div className="flex gap-6">

        <SearchBoxWithButton

          searchTerm={searchTerm}

          onSearchTermChange={setSearchTerm}

          onSearchClick={handleSearchExecution}

          onOpenAdvancedFilters={() => setIsAdvancedFilterOpen((prev) => !prev)}

          showViewToggle={false}

          placeholder="Buscar por Cliente, VehÃ­culo o ID de Alquiler..."

        />

      </div>



      <div className="mt-6 flex gap-6">

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



        <div className="flex-grow">

          <GenericTable

            columns={columns}

            data={filteredRentals}

            emptyMessage="No se encontraron alquileres que coincidan con los filtros."

          >

            {(rental) => (

              <tr

                key={rental.id}

                className="hover:bg-gray-50 transition-colors duration-150"

              >

                <td className="px-6 py-4 whitespace-nowrap">

                  <div className="text-sm font-semibold text-gray-900">

                    {rental.id}

                  </div>

                </td>



                <td className="px-6 py-4 whitespace-nowrap">

                  <div className="text-sm font-medium text-gray-900">

                    {rental.clientName}

                  </div>

                  <div className="text-xs text-gray-500">

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



                <td className="px-6 py-4 whitespace-nowrap text-right">

                  <div className="text-sm font-extrabold text-gray-900">

                    {formatCurrency(rental.total)}

                  </div>

                </td>



                <td className="px-6 py-4 whitespace-nowrap">

                  <StatusBadge status={rental.status} />

                </td>



                <TableActionCell

                  data={rental}

                  onAction={

                    rental.status === "ALQUILADO" ||

                    rental.status === "INICIADO"

                      ? handleOpenFinishModal

                      : null

                  }

                  additionalActionIcon={CheckCircle}

                  additionalActionTitle="Finalizar Alquiler"

                  onEdit={handleOpenEditModal}

                  onDelete={

                    rental.status !== "FINALIZADO" ? handleDelete : null

                  }

                />

              </tr>

            )}

          </GenericTable>

        </div>

      </div>



      <ReservationFormModal

        isOpen={isEditModalOpen}

        onClose={handleCloseEditModal}

        onSubmit={handleEditSubmit}

        reservationToEdit={rentalToEdit}

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
