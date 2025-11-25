import { apiService } from "./api.service";

export const leaseService = {
  // Get all leases/rentals
  getAll: async () => {
    return await apiService.get(`/alquileres/`);
  },

  // Get lease by ID
  getById: async (leaseId) => {
    return await apiService.get(`/alquileres/${leaseId}`);
  },

  // Create new lease
  create: async (leaseData) => {
    return await apiService.post("/alquileres", leaseData);
  },

  // Update lease
  update: async (leaseId, leaseData) => {
    return await apiService.put(`/alquileres/${leaseId}`, leaseData);
  },

  // Delete lease
  delete: async (leaseId) => {
    return await apiService.delete(`/alquileres/${leaseId}`);
  },

  // Start rental (if you have a specific endpoint)
  start: async (leaseId, startData) => {
    return await apiService.post(`/alquileres/${leaseId}/iniciar`, startData);
  },

  // Finish rental (if you have a specific endpoint)
  finish: async (leaseId, finishData) => {
    return await apiService.post(`/alquileres/${leaseId}/finalizar`, finishData);
  },
};
