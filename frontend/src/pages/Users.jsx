import { useState } from "react";
import { Plus, Search, Sliders, X, Key } from "lucide-react";
import mockUsers from "../mocks/users.json";
import mockEmployees from "../mocks/employees.json";
import UserList from "../components/user/UserList";
import UserFormModal from "../components/user/UserFormModal";
import SearchBoxWithButton from "../components/ui/SearchBoxWithButton";
import StyledPrimaryButton from "../components/ui/StyledPrimaryButton";

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [employeesList] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchExecution = () => {
    console.log("Ejecutando búsqueda de usuarios con:", searchTerm);
  };

  const handleOpenCreateModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleFormSubmit = (formData) => {
    if (userToEdit) {
      console.log("Actualizando contraseña para:", formData.username);
    } else {
      const newUser = {
        userId: `u${new Date().getTime()}`,
        employeeId: formData.employeeId,
        username: formData.username,
        employeeName: formData.employeeName,
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    handleCloseModal();
  };

  const handleDelete = (userId) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este usuario? Perderá el acceso al sistema."
      )
    ) {
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    }
  };

  return (
    <section className="space-y-6">
      {}
      <header className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Usuarios del Sistema
        </h1>
        <StyledPrimaryButton onClick={handleOpenCreateModal}>
          <Plus className="w-5 h-5" />
          <span>Crear Usuario</span>
        </StyledPrimaryButton>
      </header>

      {}
      <div className="flex gap-6">
        <SearchBoxWithButton
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchClick={handleSearchExecution}
          onOpenAdvancedFilters={() => setIsAdvancedFilterOpen((prev) => !prev)}
          view="table"
          showViewToggle={false}
          placeholder="Buscar por Nombre de Usuario o Empleado..."
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
                Filtros de Acceso
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
                Cargo de Empleado:
              </div>
              <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                (Dropdown de Cargo Mock)
              </div>
            </div>
          </div>
        )}

        {}
        <div className="flex-grow">
          <UserList
            users={filteredUsers}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        userToEdit={userToEdit}
        employeesList={employeesList}
      />
    </section>
  );
}
