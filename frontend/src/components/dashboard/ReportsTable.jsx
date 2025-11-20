import React, { useState } from "react";
import { Sliders, X } from "lucide-react";

const STATUS_COLORS = {
  FINALIZADO: "bg-green-100 text-green-800",
  ALQUILADO: "bg-blue-100 text-blue-800",
  RESERVADO: "bg-yellow-100 text-yellow-800",
  DEFAULT: "bg-gray-100 text-gray-700",
};

const MONTH_ORDER = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const getMonthAbbr = (dateString) => {
  if (!dateString) return "N/A";

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return MONTH_ORDER[date.getMonth()];
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("es-AR", options);
};

const getStatus = (rentalId) => {
  if (rentalId === "r001" || rentalId === "r003")
    return { name: "FINALIZADO", color: STATUS_COLORS.FINALIZADO };
  if (rentalId === "r002")
    return { name: "ALQUILADO", color: STATUS_COLORS.ALQUILADO };
  return { name: "RESERVADO", color: STATUS_COLORS.RESERVADO };
};

const applyDateRangeFilter = (data, dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) return data;

  const startFilter = dateFrom ? new Date(dateFrom) : null;
  const endFilter = dateTo ? new Date(dateTo) : null;

  return data.filter((item) => {
    const itemStartDate = new Date(item.startDate);

    let passesFilter = true;

    if (startFilter && itemStartDate < startFilter) {
      passesFilter = false;
    }

    if (endFilter && itemStartDate > endFilter) {
      passesFilter = false;
    }

    return passesFilter;
  });
};

const applyMonthRangeFilter = (data, monthRangeFilter, hasDateRangeFilter) => {
  if (hasDateRangeFilter || !monthRangeFilter) return data;

  const { start, end } = monthRangeFilter;
  const startIndex = MONTH_ORDER.indexOf(start);
  const endIndex = MONTH_ORDER.indexOf(end);

  if (startIndex === -1 || endIndex === -1) return data;

  return data.filter((item) => {
    const itemMonthAbbr = getMonthAbbr(item.startDate);
    const itemMonthIndexInOrder = MONTH_ORDER.indexOf(itemMonthAbbr);

    return (
      itemMonthIndexInOrder >= startIndex && itemMonthIndexInOrder <= endIndex
    );
  });
};

const ReportByClientSummary = ({
  rentalsData,
  selectedFilterValue,
  dateFrom,
  dateTo,
}) => {
  let data = applyDateRangeFilter(rentalsData || [], dateFrom, dateTo);

  const filteredData = selectedFilterValue
    ? data.filter((item) => item.clientName === selectedFilterValue)
    : data;

  const groupedByClient = filteredData.reduce((acc, item) => {
    const key = item.clientName;
    if (!acc[key])
      acc[key] = {
        clientName: key,
        totalRentals: 0,
        totalAmount: 0,
        latestDate: item.endDate || item.startDate,
      };
    acc[key].totalRentals++;
    acc[key].totalAmount += item.total;
    if (new Date(item.endDate) > new Date(acc[key].latestDate))
      acc[key].latestDate = item.endDate;
    return acc;
  }, {});

  const reportData = Object.values(groupedByClient);

  return (
    <div className="overflow-x-auto">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">
        Resumen: Total de Alquileres por Cliente
      </h4>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Alquileres
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Monto Total ($)
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Última Transacción
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
              <td className="px-6 py-4 whitespace-nowrap text-base font-extrabold text-gray-900">
                $
                {report.totalAmount.toLocaleString("es-AR", {
                  minimumFractionDigits: 0,
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(report.latestDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reportData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No hay datos que coincidan con el filtro.
        </div>
      )}
    </div>
  );
};

const ReportByVehicleSummary = ({
  rentalsData,
  selectedFilterValue,
  dateFrom,
  dateTo,
}) => {
  let data = applyDateRangeFilter(rentalsData || [], dateFrom, dateTo);

  const filteredData = selectedFilterValue
    ? data.filter((item) => item.vehicleName === selectedFilterValue)
    : data;

  const groupedByVehicle = filteredData.reduce((acc, item) => {
    const key = item.vehicleName;
    if (!acc[key])
      acc[key] = {
        vehicleName: key,
        totalRentals: 0,
        totalAmount: 0,
        latestDate: item.endDate || item.startDate,
      };
    acc[key].totalRentals++;
    acc[key].totalAmount += item.total;
    if (new Date(item.endDate) > new Date(acc[key].latestDate))
      acc[key].latestDate = item.endDate;
    return acc;
  }, {});

  const reportData = Object.values(groupedByVehicle);

  return (
    <div className="overflow-x-auto">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">
        Resumen: Total de Alquileres por Vehículo
      </h4>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Vehículo
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Alquileres
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Monto Total ($)
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Último Alquiler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reportData.map((report) => (
            <tr
              key={report.vehicleName}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {report.vehicleName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {report.totalRentals}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-base font-extrabold text-gray-900">
                $
                {report.totalAmount.toLocaleString("es-AR", {
                  minimumFractionDigits: 0,
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(report.latestDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reportData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No hay datos que coincidan con el filtro.
        </div>
      )}
    </div>
  );
};

const ReportByMonthDetail = ({
  rentalsData,
  selectedFilterValue,
  dateFrom,
  dateTo,
}) => {
  let data = applyDateRangeFilter(rentalsData || [], dateFrom, dateTo);

  const [filterMonth, filterYear] = selectedFilterValue.split("-");

  const filteredData = data.filter((item) => {
    if (!selectedFilterValue) return true;

    const date = new Date(item.startDate);
    const itemMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const itemYear = date.getFullYear().toString();

    return itemMonth === filterMonth && itemYear === filterYear;
  });

  return (
    <div className="overflow-x-auto">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">
        Listado de Transacciones Detalladas (Filtrado por Mes/Fecha)
      </h4>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Fecha Inicio
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ID Alquiler
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Vehículo
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total ($)
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((item, index) => {
            const status = getStatus(item.rentalId);
            return (
              <tr
                key={item.rentalId + index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatDate(item.startDate)}
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
                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                  $
                  {item.total.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                  >
                    {status.name}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No hay transacciones registradas para el período seleccionado.
        </div>
      )}
    </div>
  );
};

export default function ReportsTable({
  rentalsData,
  crossFilterVehicle,
  monthRangeFilter,
  onClearVehicleFilter,
  onClearMonthRangeFilter,
}) {
  const data = rentalsData || [];

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const isDateRangeActive = dateFrom !== "" || dateTo !== "";

  let filteredDataByMaster = data;
  const isVehicleFiltered = crossFilterVehicle !== "";
  if (isVehicleFiltered) {
    filteredDataByMaster = data.filter(
      (item) => item.vehicleName === crossFilterVehicle
    );
  }

  let finalFilteredData = filteredDataByMaster;
  const isMonthRangeActive = monthRangeFilter !== null && !isDateRangeActive;

  if (isMonthRangeActive) {
    finalFilteredData = applyMonthRangeFilter(
      filteredDataByMaster,
      monthRangeFilter,
      isDateRangeActive
    );
  }

  const isCrossFiltered =
    isVehicleFiltered || isMonthRangeActive || isDateRangeActive;

  const allClients = [
    ...new Set(finalFilteredData.map((item) => item.clientName)),
  ];
  const allVehicles = [
    ...new Set(finalFilteredData.map((item) => item.vehicleName)),
  ];

  const allMonths = [
    ...new Set(
      finalFilteredData.map((item) => {
        const date = new Date(item.startDate);
        return `${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
      })
    ),
  ]
    .sort()
    .reverse();

  const [selectedReport, setSelectedReport] = useState("byClientSummary");
  const [selectedFilterValue, setSelectedFilterValue] = useState("");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const handleClearCrossFilters = () => {
    setDateFrom("");
    setDateTo("");

    onClearMonthRangeFilter();

    onClearVehicleFilter();
  };

  const renderReportContent = () => {
    const commonProps = {
      rentalsData: finalFilteredData,
      selectedFilterValue,
      dateFrom,
      dateTo,
    };

    switch (selectedReport) {
      case "byClientSummary":
        return <ReportByClientSummary {...commonProps} />;
      case "byVehicleSummary":
        return <ReportByVehicleSummary {...commonProps} />;
      case "byMonthDetail":
        return <ReportByMonthDetail {...commonProps} />;
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            Seleccione un tipo de reporte para empezar.
          </div>
        );
    }
  };

  const getFilterOptions = () => {
    if (selectedReport === "byClientSummary")
      return { label: "Cliente", options: allClients };
    if (selectedReport === "byVehicleSummary")
      return { label: "Vehículo", options: allVehicles };
    if (selectedReport === "byMonthDetail")
      return { label: "Mes", options: allMonths, isDate: true };
    return { label: "", options: [] };
  };

  const filterOptions = getFilterOptions();

  const getMonthName = (value) => {
    if (!value) return "";
    const [month, year] = value.split("-");
    const date = new Date(year, month - 1, 1);
    return `${date.toLocaleString("es-AR", { month: "long" })} ${year}`;
  };

  const handleReportTypeChange = (e) => {
    setSelectedReport(e.target.value);
    setSelectedFilterValue("");
    setIsAdvancedFilterOpen(false);
  };

  return (
    <div className="space-y-6 lg:col-span-4">
      {}
      {isCrossFiltered && (
        <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded-md shadow-md flex justify-between items-center transition-all duration-300">
          <p className="font-semibold text-purple-800">
            {isVehicleFiltered && `Vehículo Filtrado: ${crossFilterVehicle}`}
            {isMonthRangeActive &&
              `Rango de Meses: ${monthRangeFilter.start} a ${monthRangeFilter.end}`}
            {isDateRangeActive &&
              `Rango de Fechas: ${formatDate(dateFrom)} a ${formatDate(
                dateTo
              )}`}
            (Filtro Maestro Activo)
          </p>
          <button
            onClick={handleClearCrossFilters}
            className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Limpiar Filtro
          </button>
        </div>
      )}

      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-xl flex flex-col md:flex-row md:items-end gap-4">
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
            onChange={handleReportTypeChange}
            disabled={isCrossFiltered}
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isCrossFiltered ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="byClientSummary">
              Resumen de Alquileres por Cliente
            </option>
            <option value="byVehicleSummary">
              Resumen de Alquileres por Vehículo
            </option>
            <option value="byMonthDetail">Listado Detallado por Mes</option>
          </select>
        </div>

        {}
        {filterOptions.label !== "" && (
          <div className="flex-1">
            <label
              htmlFor="entityFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filtrar por {filterOptions.label}
            </label>
            <select
              id="entityFilter"
              value={selectedFilterValue}
              onChange={(e) => setSelectedFilterValue(e.target.value)}
              disabled={isCrossFiltered}
              className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isCrossFiltered ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="">
                {filterOptions.isDate
                  ? "Todo el historial"
                  : `Todos los ${filterOptions.label}s`}
              </option>
              {filterOptions.options.map((option) => (
                <option key={option} value={option}>
                  {filterOptions.isDate ? getMonthName(option) : option}
                </option>
              ))}
            </select>
          </div>
        )}

        {}
        <div className="md:pt-4">
          <button
            onClick={() => setIsAdvancedFilterOpen((prev) => !prev)}
            disabled={isMonthRangeActive}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md transition-colors duration-200 w-full md:w-auto ${
              isMonthRangeActive
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span>
              {isAdvancedFilterOpen ? "Ocultar Filtro" : "Rango de Fechas"}
            </span>
          </button>
        </div>
      </div>

      {}
      {isAdvancedFilterOpen && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 flex flex-wrap gap-4 transition-all duration-300">
          <h3 className="w-full font-bold text-lg flex items-center gap-2 text-gray-800 border-b pb-2 mb-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            Filtro por Rango de Fechas (Fecha de Inicio del Alquiler)
          </h3>

          {}
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="dateFrom"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Desde (Fecha Inicio)
            </label>
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                onClearMonthRangeFilter();
              }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {}
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="dateTo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Hasta (Fecha Inicio)
            </label>
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                onClearMonthRangeFilter();
              }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {}
          <div className="md:pt-4">
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-100 text-red-700 font-semibold rounded-lg shadow-md transition-colors duration-200 hover:bg-red-200 w-full md:w-auto"
            >
              <X className="w-5 h-5" />
              <span>Limpiar Fechas</span>
            </button>
          </div>
        </div>
      )}

      {}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden">
        {renderReportContent()}
      </div>
    </div>
  );
}
