// src/pages/UserDetailsPage.tsx
import AccountCard from "@/components/AccountCard/AccountCard";
import axiosInstance from "@/config/axiosInstance";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserDetailsPage.css";

interface Cuenta {
  id: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo: string;
  moneda: string;
  fechaCreacion: string;
  estado: string;
}

interface User {
  _id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  whatsapp: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  cuentas: Cuenta[];
}

const UserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!userId) {
      setError("ID de usuario no proporcionado");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res: any = await axiosInstance.get(`/api/progresar/usuarios/${userId}`);
        setUser(res.data.data);
        setError("");
      } catch (err: unknown) {
        let errorMessage = "Error al obtener usuario";

        if (err && typeof err === "object") {
          if ("response" in err && err.response && typeof err.response === "object" && "data" in err.response) {
            const responseData = err.response.data as any;
            errorMessage = responseData?.message || errorMessage;
          } else if ("message" in err && typeof err.message === "string") {
            errorMessage = err.message;
          }
        }

        console.error("Error al obtener usuario", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="user-details-loading">
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-details-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-details-error">
        <p>No se encontró el usuario.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "👑 Administrador",
      user: "👤 Usuario",
      moderator: "🛡️ Moderador",
    };
    return roleMap[role] || `🔖 ${role}`;
  };

  return (
    <div className="user-details">
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      <h2>
        {user.name} {user.lastName}
      </h2>

      <p>
        <strong>📧 Email:</strong>
        <span>{user.email}</span>
      </p>

      <p>
        <strong>📱 Teléfono:</strong>
        <span>{user.whatsapp}</span>
      </p>

      <p>
        <strong>👥 Rol:</strong>
        <span>{formatRole(user.role)}</span>
      </p>

      <p>
        <strong>🟢 Estado:</strong>
        <span>{user.isActive ? "✅ Activo" : "❌ Inactivo"}</span>
      </p>

      <p>
        <strong>📅 Fecha de Registro:</strong>
        <span>{formatDate(user.createdAt)}</span>
      </p>

      <h3>Cuentas</h3>

      {user.cuentas?.length > 0 ? (
        <div className="grid grid-3">
          {user.cuentas.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <p>Este usuario no tiene cuentas registradas.</p>
      )}
    </div>
  );
};

export default UserDetailsPage;
