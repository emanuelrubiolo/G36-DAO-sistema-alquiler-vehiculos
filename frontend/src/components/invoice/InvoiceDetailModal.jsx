import { X, Printer } from "lucide-react";

const formatDate = (
  dateString,
  options = { year: "numeric", month: "2-digit", day: "2-digit" }
) => {
  if (!dateString) return "N/A";
  const fullOptions = dateString.includes("T")
    ? { ...options, hour: "2-digit", minute: "2-digit" }
    : options;
  return new Date(dateString).toLocaleString("es-AR", fullOptions);
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="text-sm font-semibold text-gray-900 text-right">
      {value}
    </span>
  </div>
);

export default function InvoiceDetailModal({
  isOpen,
  onClose,
  invoice,
  rental,
}) {
  if (!isOpen || !invoice) return null;

  const { id, issueDate, total, paymentMethod, status } = invoice;
  const {
    clientName,
    vehicleName,
    startDate,
    endDate,
    kilometraje_inicio,
    kilometraje_fin,
  } = rental || {};

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
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Detalle de Factura
            </h2>
            <p className="text-sm text-gray-500">Factura ID: {id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Datos de Facturación
            </h3>
            <DetailRow label="Estado" value={status} />
            <DetailRow label="Fecha de Emisión" value={formatDate(issueDate)} />
            <DetailRow label="Método de Pago" value={paymentMethod} />
            <DetailRow
              label="Monto Total"
              value={`$${total.toLocaleString("es-AR")}`}
            />
          </div>

          {rental ? (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Detalles del Alquiler (ID: {rental.id})
              </h3>
              <DetailRow label="Cliente" value={clientName} />
              <DetailRow label="Vehículo" value={vehicleName} />
              <DetailRow
                label="Período de Alquiler"
                value={`${formatDate(startDate)} - ${formatDate(endDate)}`}
              />
              <DetailRow
                label="Km Inicial"
                value={`${kilometraje_inicio?.toLocaleString("es-AR")} km`}
              />
              <DetailRow
                label="Km Final"
                value={`${
                  kilometraje_fin?.toLocaleString("es-AR") || "N/A"
                } km`}
              />
            </div>
          ) : (
            <p className="text-sm text-red-500">
              Error: No se encontraron los detalles del alquiler asociado (ID:{" "}
              {invoice.rentalId}).
            </p>
          )}
        </div>

        <footer className="flex justify-end gap-3 p-5 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700"
          >
            <Printer className="w-5 h-5" />
            Imprimir
          </button>
        </footer>
      </div>
    </div>
  );
}
