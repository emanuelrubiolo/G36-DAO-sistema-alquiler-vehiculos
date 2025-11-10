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

export default function VehicleCard({ vehicle }) {
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
}
