import { useState } from "react";
import { Filter, Download } from "lucide-react";

import mockReports from "../mocks/reports.json";
import mockClients from "../mocks/clients.json";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("es-AR", options);
};

const ReportByClient = ({ data, selectedClient }) => {
  const filteredData = selectedClient
    ? data.filter((item) => item.clientName === selectedClient)
    : data;

  return (
    <table className="w-full min-w-max divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
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
            Alquiler ID
          </th>
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
            Período
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            Total
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredData.map((item) => (
          <tr key={item.rentalId} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.clientName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.rentalId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
              {item.vehicleName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
              ${item.total}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ReportByMonth = ({ data }) => (
  <table className="w-full min-w-max divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
        >
          Mes
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
        >
          Alquiler ID
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
          Total
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item) => (
        <tr key={item.rentalId} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {item.month}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {item.rentalId}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            {item.clientName}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
            ${item.total}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("byClient");
  const [selectedClient, setSelectedClient] = useState("");

  const { rentalsByClient, rentalsByMonth } = mockReports;
  const clientsList = mockClients;

  const renderReport = () => {
    switch (selectedReport) {
      case "byClient":
        return (
          <ReportByClient
            data={rentalsByClient}
            selectedClient={selectedClient}
          />
        );
      case "byMonth":
        return <ReportByMonth data={rentalsByMonth} />;
      default:
        return (
          <p className="p-8 text-center text-gray-500">
            Seleccione un tipo de reporte.
          </p>
        );
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Centro de Reportes</h1>
      </header>

      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <label
            htmlFor="reportType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Reporte
          </label>
          <select
            id="reportType"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="byClient">Listado de alquileres por cliente</option>
            <option value="byMonth">Listado de alquileres por mes</option>
          </select>
        </div>

        {selectedReport === "byClient" && (
          <div className="flex-1">
            <label
              htmlFor="clientFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filtrar por Cliente (Opcional)
            </label>
            <select
              id="clientFilter"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los clientes</option>
              {clientsList.map((client) => (
                <option key={client.id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-6">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-200">
            <Download className="w-5 h-5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">{renderReport()}</div>
      </div>
    </section>
  );
}
