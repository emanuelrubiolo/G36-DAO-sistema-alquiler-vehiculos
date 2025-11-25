import apiService from "./api.service";

export const dashboardService = {
  getData: async () => {
    try {
      const response = await apiService.get("/dashboard");
      const data = response?.data || response;

      if (!data) {
        throw new Error("No se recibieron datos del dashboard");
      }

      const months = [
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

      // 1. Calcular conteo de alquileres por mes usando detailedRentals
      const rentalsCountByMonth = {};
      months.forEach((m) => (rentalsCountByMonth[m] = 0));

      (data.detailedRentals || []).forEach((rental) => {
        const dateStr = rental.startDate || rental.date_time_start;
        if (dateStr) {
          // Manejo robusto de fechas (acepta "2025-11-25" y formatos ISO)
          const date = new Date(dateStr);
          // Ajuste de zona horaria simple para evitar saltos de mes por UTC
          const userTimezoneOffset = date.getTimezoneOffset() * 60000;
          const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

          if (!isNaN(adjustedDate)) {
            const monthIndex = adjustedDate.getMonth(); // 0-11
            const monthName = months[monthIndex];
            rentalsCountByMonth[monthName] =
              (rentalsCountByMonth[monthName] || 0) + 1;
          }
        }
      });

      // 2. Fusionar Ingresos (del backend) con Conteos (calculados)
      const monthlyRevenue = (data.monthlyRevenue || []).map((item) => ({
        ...item,
        // Aseguramos que exista 'count', tomándolo del cálculo anterior si coincide el mes
        count: rentalsCountByMonth[item.month] || 0,
      }));

      // 3. Mapeo para PopularVehiclesChart
      const popularVehicles = (data.popularVehicles || []).map((item) => ({
        name: item.name,
        value: item.rentals,
      }));

      // 4. Mapeo para ReportsTable
      const detailedRentals = (data.detailedRentals || []).map((item) => ({
        id: item.rentalId,
        clientName: item.clientName,
        vehicle: item.vehicleName,
        startDate: item.startDate,
        endDate: item.endDate,
        total: parseFloat(item.total || 0),
        status: "Finalizado",
        invoiceStatus: "Emitida",
      }));

      return {
        kpis: data.kpis || {
          totalRevenue: 0,
          totalRentals: 0,
          activeClients: 0,
          availableVehicles: 0,
        },
        monthlyRevenue, // Ahora incluye 'total' y 'count'
        popularVehicles,
        detailedRentals,
      };
    } catch (error) {
      console.error("Error obteniendo datos del dashboard:", error);
      return {
        kpis: {
          totalRevenue: 0,
          totalRentals: 0,
          activeClients: 0,
          availableVehicles: 0,
        },
        monthlyRevenue: [],
        popularVehicles: [],
        detailedRentals: [],
      };
    }
  },
};
