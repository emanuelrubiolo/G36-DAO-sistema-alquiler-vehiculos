import StyledActionButton from "../ui/StyledActionButton";
import { Edit, Trash2, Eye } from "lucide-react";

// Helper para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("es-AR", options);
};

// Helper robusto para moneda
const formatCurrency = (amount) => {
  // Convertimos a float por si viene como string "123.00"
  const num = parseFloat(amount);

  // Validamos si es un número real
  if (!isNaN(num)) {
    return `$${num.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Valor por defecto si no hay costo válido
  return "$0,00";
};

const TypeBadge = ({ type }) => {
  const typeStyles = {
    Preventivo: "bg-blue-100 text-blue-800",
    Correctivo: "bg-red-100 text-red-800",
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

const MaintenanceStatusBadge = ({ status }) => {
  const normalized = status ? status.toLowerCase() : "";
  let color = "bg-gray-100 text-gray-800";

  if (normalized.includes("iniciado")) color = "bg-yellow-100 text-yellow-800";
  if (normalized.includes("proceso")) color = "bg-blue-100 text-blue-800";
  if (normalized.includes("finalizado")) color = "bg-green-100 text-green-800";

  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${color}`}
    >
      {status}
    </span>
  );
};

export default function MaintenanceList({ maintenanceJobs, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Vehículo / Descripción
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
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Costo
              </th>
              <th scope="col" className="relative px-6 py-3 text-right">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {maintenanceJobs.map((job) => {
              // Corrección: Usar .includes() para ser más flexible con el estado
              const statusLower = job.status ? job.status.toLowerCase() : "";
              const isFinalized = statusLower.includes("finalizado");

              return (
                <tr
                  key={job.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {job.vehicleName}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
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
                    <MaintenanceStatusBadge status={job.status || "Iniciado"} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-extrabold text-gray-900">
                      {formatCurrency(job.cost)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-1">
                      <StyledActionButton
                        onClick={() => onEdit(job)}
                        title={
                          isFinalized ? "Ver Detalle" : "Ver/Modificar Registro"
                        }
                        colorClass={
                          isFinalized ? "text-gray-600" : "text-blue-600"
                        }
                        isIconOnly={true}
                      >
                        {isFinalized ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <Edit className="w-5 h-5" />
                        )}
                      </StyledActionButton>

                      <StyledActionButton
                        onClick={() => onDelete(job.id)}
                        title="Eliminar Registro"
                        colorClass="text-red-600"
                        isIconOnly={true}
                      >
                        <Trash2 className="w-5 h-5" />
                      </StyledActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {maintenanceJobs.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No se encontraron registros de mantenimiento.
        </div>
      )}
    </div>
  );
}
