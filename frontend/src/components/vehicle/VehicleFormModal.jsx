import { X } from "lucide-react";
import { useState, useEffect } from "react";

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

export default function VehicleFormModal({
  isOpen,
  onClose,
  onSubmit,
  vehicleToEdit,
}) {
  const getInitialState = () => ({
    brand: vehicleToEdit?.brand || "",
    model: vehicleToEdit?.model || "",
    patente: vehicleToEdit?.patente || "",
    year: vehicleToEdit?.year || 2024,
    pricePerDay: vehicleToEdit?.pricePerDay || 0,
    transmission: vehicleToEdit?.transmission || "Manual",
    fuel: vehicleToEdit?.fuel || "Nafta",
    thumbnail: vehicleToEdit?.thumbnail || "",
    kilometraje_actual: vehicleToEdit?.kilometraje_actual || 0,
    estado: vehicleToEdit?.estado || "DISPONIBLE",
  });

  const [formData, setFormData] = useState(getInitialState());

  const isEditing = !!vehicleToEdit;
  const title = isEditing ? "Editar Vehículo" : "Agregar Nuevo Vehículo";

  useEffect(() => {
    setFormData(getInitialState());
  }, [vehicleToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto">
            <FormInput
              label="Marca"
              id="brand"
              name="brand"
              type="text"
              value={formData.brand}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Modelo"
              id="model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Patente"
              id="patente"
              name="patente"
              type="text"
              value={formData.patente}
              onChange={handleChange}
              placeholder="Ej: AA 123 BB"
              required
            />
            <FormInput
              label="Año"
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Precio por Día"
              id="pricePerDay"
              name="pricePerDay"
              type="number"
              step="0.01"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
            />
            <FormSelect
              label="Transmisión"
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
            >
              <option value="Manual">Manual</option>
              <option value="Automático">Automático</option>
            </FormSelect>
            <FormSelect
              label="Combustible"
              id="fuel"
              name="fuel"
              value={formData.fuel}
              onChange={handleChange}
            >
              <option value="Nafta">Nafta</option>
              <option value="Diésel">Diésel</option>
              <option value="Eléctrico">Eléctrico</option>
            </FormSelect>
            <FormInput
              label="Kilometraje Actual"
              id="kilometraje_actual"
              name="kilometraje_actual"
              type="number"
              value={formData.kilometraje_actual}
              onChange={handleChange}
            />
            <FormSelect
              label="Estado"
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="NO_DISPONIBLE">No Disponible (Alquilado)</option>
              <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
            </FormSelect>

            <div className="md:col-span-2">
              <FormInput
                label="URL de Imagen (thumbnail)"
                id="thumbnail"
                name="thumbnail"
                type="text"
                value={formData.thumbnail}
                onChange={handleChange}
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
              {isEditing ? "Guardar Cambios" : "Crear Vehículo"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
