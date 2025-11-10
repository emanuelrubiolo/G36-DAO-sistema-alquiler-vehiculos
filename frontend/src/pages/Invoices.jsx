import { useState } from "react";

import { Search, FileText, CheckCircle, Clock, Eye } from "lucide-react";
import mockInvoices from "../mocks/invoices.json";

import mockReservations from "../mocks/reservations.json";

import InvoiceDetailModal from "../components/invoice/InvoiceDetailModal";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("es-AR", options);
};

const InvoiceStatusBadge = ({ status }) => {
  const isPaid = status === "COBRADA";
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
        isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );
};

export default function Invoices() {
  const [invoices, setInvoices] = useState(mockInvoices);

  const [reservations, setReservations] = useState(mockReservations);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState({
    invoice: null,
    rental: null,
  });

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.rentalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsPaid = (invoiceId) => {
    console.log("Marcando como cobrada:", invoiceId);
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "COBRADA" } : inv
      )
    );
  };

  const handleOpenDetailModal = (invoice) => {
    const rental = reservations.find((r) => r.id === invoice.rentalId);
    setSelectedDetail({ invoice, rental });
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDetail({ invoice: null, rental: null });
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Facturación
        </h1>
      </header>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between gap-4 border-b border-gray-200">
          {}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente o ID de alquiler..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="COBRADA">Cobrada</option>
              <option value="NO COBRADA">No Cobrada</option>
            </select>
          </div>
        </div>

        {}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Factura / Alquiler
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Cliente
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Fecha Emisión
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ID Factura: {invoice.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID Alquiler: {invoice.rentalId}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.clientName}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {formatDate(invoice.issueDate)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${invoice.total}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>

                  {}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      {}
                      <button
                        onClick={() => handleOpenDetailModal(invoice)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver Detalle"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {}
                      {invoice.status === "NO COBRADA" && (
                        <button
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Marcar como Cobrada"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron facturas que coincidan con los filtros.
          </div>
        )}
      </div>

      {}
      <InvoiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        invoice={selectedDetail.invoice}
        rental={selectedDetail.rental}
      />
    </section>
  );
}
