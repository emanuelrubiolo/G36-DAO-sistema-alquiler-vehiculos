import { apiService } from "./api.service";

export const dashboardService = {
  // Get all dashboard data
  getData: async () => {
    return await apiService.get("/dashboard");
  },

  // You can add specific dashboard endpoints here
  // getKPIs: async () => { ... },
  // getChartData: async (chartType) => { ... },
};
