import { useState } from "react";
import { Search, Plus, Edit, Trash2, LayoutGrid, List } from "lucide-react";
import mockClients from "../mocks/clients.json";
import ClientFormModal from "../components/client/ClientFormModal";
import ClientCard from "../components/client/ClientCard";
import StyledActionButton from "../components/ui/StyledActionButton";

import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";

const getToggleClasses = (currentView, buttonView) => {
  return `p-2 rounded-lg transition-all duration-200 ${
    currentView === buttonView
      ? "bg-blue-100 text-blue-600 shadow-sm"
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
  }`;
};

const StatusBadge = ({ status }) => {
  const isActive = status === "Activo";
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );
};

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState(mockClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [view, setView] = useState("grid");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.dni.includes(searchTerm)
  );

  const handleOpenCreateModal = () => {
    setClientToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClientToEdit(null);
  };

  const handleFormSubmit = (formData) => {
    if (clientToEdit) {
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === clientToEdit.id ? { ...clientToEdit, ...formData } : c
        )
      );
    } else {
      const newClient = {
        id: `c${new Date().getTime()}`,
        ...formData,
      };
      setClients((prevClients) => [newClient, ...prevClients]);
    }
    handleCloseModal();
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      setClients((prevClients) => prevClients.filter((c) => c.id !== clientId));
    }
  };

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Nombre
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              DNI
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Contacto
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
          {filteredClients.map((client) => (
            <tr
              key={client.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {client.name}
                </div>
                <div className="text-sm text-gray-500">{client.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {client.dni}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-800">{client.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={client.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center gap-1">
                  <StyledActionButton
                    onClick={() => handleOpenEditModal(client)}
                    title="Modificar"
                    colorClass="text-blue-600"
                    size="size-8"
                  >
                    <Edit className="w-4 h-4" />
                  </StyledActionButton>
                  <StyledActionButton
                    onClick={() => handleDeleteClient(client.id)}
                    title="Eliminar"
                    colorClass="text-red-600"
                    size="size-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </StyledActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 transition-opacity duration-500">
      {filteredClients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteClient}
        />
      ))}
    </div>
  );

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Clientes
        </h1>
      </header>

      <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-200">
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, email o DNI..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setView("grid")}
                className={getToggleClasses(view, "grid")}
                aria-label="Vista de Cuadrícula"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView("table")}
                className={getToggleClasses(view, "table")}
                aria-label="Vista de Tabla"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {}
          <StyledPrimaryButton onClick={handleOpenCreateModal}>
            <Plus className="w-5 h-5" />
            <span>Agregar Cliente</span>
          </StyledPrimaryButton>
        </div>

        {view === "table" && <TableView />}
        {view === "grid" && <GridView />}

        {filteredClients.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron clientes que coincidan con la búsqueda.
          </div>
        )}
      </div>

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        clientToEdit={clientToEdit}
      />
    </section>
  );
}
