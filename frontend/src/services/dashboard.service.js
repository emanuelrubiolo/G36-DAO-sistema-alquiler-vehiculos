import { apiService } from "./api.service";

export const dashboardService = {
  getData: async () => {
    try {
      // Consumir el endpoint real del backend
      const response = await apiService.get("/dashboard");
      const data = response?.data || response;

      if (!data) {
        throw new Error("No se recibieron datos del dashboard");
      }

      // --- ADAPTADOR DE DATOS (Backend -> Frontend) ---
      // Transformamos la respuesta para que coincida con lo que esperan los componentes visuales

      // 1. Mapeo para PopularVehiclesChart (espera 'value' en lugar de 'rentals')
      const popularVehicles = (data.popularVehicles || []).map((item) => ({
        name: item.name,
        value: item.rentals, // Mapeo clave: rentals -> value
      }));

      // 2. Mapeo para ReportsTable (espera 'id', 'vehicle', etc.)
      const detailedRentals = (data.detailedRentals || []).map((item) => ({
        id: item.rentalId, // Mapeo clave: rentalId -> id
        clientName: item.clientName,
        vehicle: item.vehicleName, // Mapeo clave: vehicleName -> vehicle
        startDate: item.startDate,
        endDate: item.endDate,
        total: parseFloat(item.total || 0),
        // Si el backend no envía estos estados en el resumen, ponemos defaults
        // para que la tabla no se vea rota.
        status: "Finalizado",
        invoiceStatus: "Emitida",
      }));

      // 3. Retornar estructura final
      return {
        kpis: data.kpis || {
          totalRevenue: 0,
          totalRentals: 0,
          activeClients: 0,
          availableVehicles: 0,
        },
        monthlyRevenue: data.monthlyRevenue || [],
        popularVehicles,
        detailedRentals,
      };
    } catch (error) {
      console.error("Error obteniendo datos del dashboard:", error);
      // Retornar estructura vacía para evitar pantalla blanca en caso de error
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
