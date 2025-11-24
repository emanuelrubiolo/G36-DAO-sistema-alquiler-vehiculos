import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const FormInput = ({ label, id, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const FormSelect = ({ label, id, children, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      id={id}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </select>
  </div>
);

const FormTextarea = ({ label, id, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <textarea
      id={id}
      rows="3"
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default function IncidentFormModal({
  isOpen,
  onClose,
  onSubmit,
  incidentToEdit,
  rentalsList = [],
}) {
  const { currentUser } = useAuth();

  const activeRentals = rentalsList.filter((r) => r.status !== "CANCELADO");

  const getInitialState = () => ({
    rentalId: incidentToEdit?.rentalId || activeRentals[0]?.id || "",
    type: incidentToEdit?.type || "Daño",
    description: incidentToEdit?.description || "",
    cost: incidentToEdit?.cost || 0,
    date: incidentToEdit?.date || new Date().toISOString().split("T")[0],
  });

  const [formData, setFormData] = useState(getInitialState());

  const isEditing = !!incidentToEdit;
  const title = isEditing ? "Editar Incidente" : "Registrar Incidente";

  useEffect(() => {
    setFormData(getInitialState());
  }, [incidentToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedRental = activeRentals.find((r) => r.id === formData.rentalId);

    const dataToSubmit = {
      ...formData,
      clientName: selectedRental?.clientName || "N/A",
      vehicleName: selectedRental?.vehicleName || "N/A",
      id_empleado: currentUser?.id,
      fecha_creacion: new Date().toISOString(),
    };

    onSubmit(dataToSubmit);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-lg shadow-xl z-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
            <FormSelect
              label="Alquiler Asociado"
              id="rentalId"
              name="rentalId"
              value={formData.rentalId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Seleccione un alquiler
              </option>
              {activeRentals.map((rental) => (
                <option key={rental.id} value={rental.id}>
                  ID: {rental.id} ({rental.clientName} - {rental.vehicleName})
                </option>
              ))}
            </FormSelect>

            <FormSelect
              label="Tipo de Incidente"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Daño">Daño</option>
              <option value="Multa">Multa</option>
            </FormSelect>

            <FormInput
              label="Fecha del Incidente"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Costo de Reparación / Multa"
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Descripción del Incidente"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detalles del daño, número de multa, etc."
                required
              />
            </div>
          </div>

          <footer className="flex justify-end gap-3 p-5 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700"
            >
              {isEditing ? "Guardar Cambios" : "Registrar"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
