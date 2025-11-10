import ReservationStatusBadge from "../reservation/ReservationStatusBadge";
import StyledActionButton from "../ui/StyledActionButton";
import { Edit, Eye, Trash2, Wrench } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("es-AR", options);
};

const TypeBadge = ({ type }) => {
  const typeStyles = {
    Preventivo: "bg-blue-100 text-blue-800",
    Correctivo: "bg-red-100 text-red-800",
    "En progreso": "bg-yellow-100 text-yellow-800",
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
                Costo
              </th>
              <th scope="col" className="relative px-6 py-3 text-right">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {maintenanceJobs.map((job) => (
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
                  <span className="text-sm font-extrabold text-gray-900">
                    $
                    {job.cost.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center gap-1">
                    {}
                    <StyledActionButton
                      onClick={() => onEdit(job)}
                      title="Ver/Modificar Registro"
                      colorClass="text-blue-600"
                      isIconOnly={true}
                    >
                      <Edit className="w-5 h-5" />
                    </StyledActionButton>
                    {}
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
            ))}
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
