import React, { useState } from "react";
import { UserList, UserForm } from "../components/Users";
import { Card, CardHeader, CardBody, Alert } from "../components/UI";
import { useUsers } from "../hooks/useUsers";
import type { User, CreateUserDto } from "../types";
import { useNavigate } from "react-router-dom";

const UsersPage: React.FC = () => {
  const { users, loading, error, createUser, deleteUser } = useUsers();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [_, setEditingUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleCreateUser = async (userData: CreateUserDto) => {
    try {
      await createUser(userData);
      setShowCreateForm(false);
      setNotification({
        type: "success",
        message: "Usuario creado exitosamente",
      });
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Error al crear usuario",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };
  const navigate = useNavigate(); // 👈 hook de navegación

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    navigate(`/users/edit/${user._id}`);
    // TODO: Implement edit modal
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
      try {
        await deleteUser(userId);
        setNotification({
          type: "success",
          message: "Usuario eliminado exitosamente",
        });
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        setNotification({
          type: "error",
          message: error instanceof Error ? error.message : "Error al eliminar usuario",
        });
        setTimeout(() => setNotification(null), 5000);
      }
    }
  };

  if (error) {
    return (
      <div className="page-content">
        <Alert
          type="error"
          title="Error de Conexión"
          message="No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose en http://localhost:3000"
        />
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="page-content">
        <Card>
          <CardHeader title="Crear Nuevo Usuario" subtitle="Complete la información del usuario" />
          <CardBody>
            <UserForm onSubmit={handleCreateUser} onCancel={() => setShowCreateForm(false)} isLoading={loading} />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-content">
      {notification && (
        <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}

      <UserList
        users={users}
        loading={loading}
        onCreateUser={() => setShowCreateForm(true)}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UsersPage;
