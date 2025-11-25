import { apiService } from "./api.service";

export const clientService = {
  // Get all clients
  getAll: async () => {
    return await apiService.get(`/clientes/`);
  },

  // Get client by ID
  getById: async (clientId) => {
    return await apiService.get(`/clientes/${clientId}`);
  },

  // Create new client
  create: async (clientData) => {
    return await apiService.post("/clientes", clientData);
  },

  // Update client
  update: async (clientId, clientData) => {
    return await apiService.put(`/clientes/${clientId}`, clientData);
  },

  // Delete client
  delete: async (clientId) => {
    return await apiService.delete(`/clientes/${clientId}`);
  },
};
