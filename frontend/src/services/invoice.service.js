import { apiService } from "./api.service";

export const invoiceService = {
  // Get all invoices
  getAll: async (skip = 0, limit = 100) => {
    return await apiService.get(`/facturas?skip=${skip}&limit=${limit}`);
  },

  // Get invoice by ID
  getById: async (invoiceId) => {
    return await apiService.get(`/facturas/${invoiceId}`);
  },

  // Create new invoice
  create: async (invoiceData) => {
    return await apiService.post("/facturas", invoiceData);
  },

  // Update invoice
  update: async (invoiceId, invoiceData) => {
    return await apiService.put(`/facturas/${invoiceId}`, invoiceData);
  },

  // Delete invoice
  delete: async (invoiceId) => {
    return await apiService.delete(`/facturas/${invoiceId}`);
  },

  // Mark as paid (if you have a specific endpoint)
  markAsPaid: async (invoiceId) => {
    return await apiService.patch(`/facturas/${invoiceId}/cobrar`);
  },
};
