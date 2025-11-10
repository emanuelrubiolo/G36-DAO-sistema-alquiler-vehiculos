import VehicleCard from "./VehicleCard";
import { Truck, DollarSign, Gauge } from "lucide-react";

const VehicleStatusBadge = ({ status }) => {
  const statusText = {
    DISPONIBLE: "Disponible",
    EN_MANTENIMIENTO: "Mantenimiento",
    NO_DISPONIBLE: "No Disponible",
  };
  const statusColor = {
    DISPONIBLE: "bg-green-600",
    EN_MANTENIMIENTO: "bg-yellow-600",
    NO_DISPONIBLE: "bg-red-600",
  };
  return (
    <span
      className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${statusColor[status]}`}
    >
      {statusText[status]}
    </span>
  );
};

const VisualVehicleCard = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.01]">
      {}
      <div className="relative h-64">
        {}
        <img
          src={
            vehicle.thumbnail ||
            "https://via.placeholder.com/600x400?text=Car-doba"
          }
          alt={vehicle.model}
          className="w-full h-full object-cover"
        />

        {}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">
                {vehicle.brand} {vehicle.model}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Truck className="w-4 h-4 text-white/80" />
                <p className="text-sm text-white/80">{vehicle.patente}</p>
              </div>
            </div>
            <VehicleStatusBadge status={vehicle.estado} />
          </div>
        </div>
      </div>

      {}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Gauge className="w-4 h-4 text-blue-500" />
            {vehicle.kilometraje_actual.toLocaleString("es-AR")} km
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span className="text-xl font-extrabold text-gray-900">
            ${vehicle.pricePerDay}
          </span>
          <span className="text-sm text-gray-500">/día</span>
        </div>
      </div>
    </div>
  );
};

export default function VehicleList({ vehicles, view }) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <VisualVehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                Patente
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
                Kilometraje
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Precio /día
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-16 h-10 object-cover rounded-md bg-gray-200"
                      src={
                        vehicle.thumbnail ||
                        "https://via.placeholder.com/150x100?text=Car-doba"
                      }
                      alt={`${vehicle.brand} ${vehicle.model}`}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.year}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {vehicle.patente}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <VehicleStatusBadge status={vehicle.estado} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-800">
                    {vehicle.kilometraje_actual.toLocaleString("es-AR")} km
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    ${vehicle.pricePerDay}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
