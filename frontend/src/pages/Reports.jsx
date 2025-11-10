import { useState } from "react";
import { Search, Sliders, Download, X } from "lucide-react";
import mockReports from "../mocks/reports.json";
import mockClients from "../mocks/clients.json";
import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("es-AR", options);
};

const ReportByClient = ({ data, selectedClient }) => {
  const filteredData = selectedClient
    ? data.filter((item) => item.clientName === selectedClient)
    : data;

  const groupedByClient = filteredData.reduce((acc, item) => {
    if (!acc[item.clientName]) {
      acc[item.clientName] = {
        clientName: item.clientName,
        totalRentals: 0,
        totalAmount: 0,
        details: [],
      };
    }
    acc[item.clientName].totalRentals++;
    acc[item.clientName].totalAmount += item.total;
    acc[item.clientName].details.push(item);
    return acc;
  }, {});

  const reportData = Object.values(groupedByClient);

  return (
    <div className="overflow-x-auto">
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
              Total Alquileres
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Monto Total ($)
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Última Fecha
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reportData.map((report) => (
            <tr
              key={report.clientName}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {report.clientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {report.totalRentals}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-gray-900">
                $
                {report.totalAmount.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(report.details[0].endDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ReportByMonth = ({ data }) => {
  const reportData = data;

  return (
    <div className="overflow-x-auto">
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
              ID Alquiler
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
              Vehículo
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
          {reportData.map((item, index) => (
            <tr
              key={item.rentalId + index}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.month}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.rentalId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {item.clientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {item.vehicleName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                $
                {item.total.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("byClient");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const { rentalsByClient, rentalsByMonth } = mockReports;
  const clientsList = mockClients;

  const handleGenerateReport = () => {
    console.log(
      `Generando reporte: ${selectedReport} con filtro de cliente: ${
        selectedClient || "Todos"
      }`
    );

    alert(
      `Reporte de '${selectedReport}' generado. (Datos mostrados en pantalla)`
    );
  };

  const handleExport = () => {
    console.log(`Exportando reporte: ${selectedReport}`);
    alert(`Simulando exportación de datos de '${selectedReport}' a CSV/Excel.`);
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case "byClient":
        if (rentalsByClient.length === 0)
          return (
            <div className="p-8 text-center text-gray-500">No hay datos.</div>
          );
        return (
          <ReportByClient
            data={rentalsByClient}
            selectedClient={selectedClient}
          />
        );
      case "byMonth":
        if (rentalsByMonth.length === 0)
          return (
            <div className="p-8 text-center text-gray-500">No hay datos.</div>
          );
        return <ReportByMonth data={rentalsByMonth} />;
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            Seleccione un tipo de reporte para empezar.
          </div>
        );
    }
  };

  return (
    <section className="space-y-6">
      {}
      <header className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-bold text-gray-900">Centro de Reportes</h1>
        {}
        <StyledPrimaryButton
          className="bg-green-600 hover:bg-green-700"
          onClick={handleExport}
        >
          <Download className="w-5 h-5" />
          <span>Exportar Datos</span>
        </StyledPrimaryButton>
      </header>

      {}
      <div className="flex gap-6">
        <SearchBoxWithButton
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchClick={handleGenerateReport}
          onOpenAdvancedFilters={() => setIsAdvancedFilterOpen((prev) => !prev)}
          showViewToggle={false}
          placeholder="Buscar por Cliente o ID de Alquiler..."
        />
      </div>

      {}
      <div className="mt-6 flex gap-6">
        {}
        {isAdvancedFilterOpen && (
          <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-5 shrink-0 transition-all duration-300">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sliders className="w-5 h-5 text-gray-600" />
                Filtros de Período
              </h3>
              <button
                onClick={() => setIsAdvancedFilterOpen(false)}
                className="btn size-8 rounded-full p-0 text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="font-semibold text-gray-700">
                Rango de Fechas:
              </div>
              <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                (Date Picker Mock aquí)
              </div>
            </div>
          </div>
        )}

        {}
        <div className="flex-grow space-y-6">
          {}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-xl flex flex-col md:flex-row md:items-center gap-4">
            {}
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
                onChange={(e) => {
                  setSelectedReport(e.target.value);
                  setSelectedClient("");
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="byClient">
                  Listado de alquileres por cliente
                </option>
                <option value="byMonth">Reporte de alquileres por mes</option>
              </select>
            </div>

            {}
            {selectedReport === "byClient" && (
              <div className="flex-1">
                <label
                  htmlFor="clientFilter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Filtrar por Cliente
                </label>
                <select
                  id="clientFilter"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {}
            <div className="md:pt-4">
              <button
                onClick={handleGenerateReport}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 hover:bg-indigo-700 w-full md:w-auto"
              >
                <Search className="w-5 h-5" />
                <span>Generar Reporte</span>
              </button>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden">
            {renderReportContent()}
          </div>
        </div>
      </div>
    </section>
  );
}
