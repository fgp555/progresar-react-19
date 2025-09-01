// src/pages/UserDetailsPage.tsx
import AccountCard from "@/components/AccountCard/AccountCard";
import axiosInstance from "@/config/axiosInstance";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./UserDetailsPage.module.css";

interface DocumentType {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Account {
  id: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo: string;
  moneda: string;
  fechaCreacion: string;
  estado: string;
}

const UserRoleEnum = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
} as const;

type UserRoleEnum = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

interface User {
  _id: string;
  username: string;
  name: string;
  lastName?: string;
  email: string;
  whatsapp?: string;
  password?: string;
  photo?: string | null;
  role: UserRoleEnum;
  isVisible: boolean;
  isActive: boolean;
  googleId?: string | null;
  displayName?: string | null;
  rawGoogle?: any | null;
  documentNumber: string;
  documentType?: DocumentType;
  cupos: number;
  createdAt: string;
  updatedAt: string;
  cuentas?: Account[];
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
      <div className={styles.loading}>
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <Link to="/users" className={styles.backLink}>
          Volver a usuarios
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.error}>
        <p>No se encontró el usuario.</p>
        <Link to="/users" className={styles.backLink}>
          Volver a usuarios
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "Administrador",
      user: "Usuario",
      moderator: "Moderador",
    };
    return roleMap[role] || role;
  };

  const formatCurrency = (amount: string): string => {
    const number = parseFloat(amount);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(number);
  };

  const getTotalBalance = (): number => {
    if (!user.cuentas || user.cuentas.length === 0) return 0;
    return user.cuentas.reduce((total, cuenta) => total + parseFloat(cuenta.saldo), 0);
  };

  return (
    <div className={styles.userDetails}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.photo ? (
              <img src={user.photo} alt={`${user.name} ${user.lastName}`} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user.name.charAt(0)}
                {user.lastName?.charAt(0)}
              </div>
            )}
          </div>
          <div className={styles.nameSection}>
            <h1 className={styles.title}>
              {user.name} {user.lastName}
            </h1>
            <div className={styles.subtitle}>
              <span className={styles.username}>@{user.username}</span>
              <span className={`${styles.status} ${user.isActive ? styles.active : styles.inactive}`}>
                {user.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Link to={`/users/edit/${userId}`} className={styles.editBtn}>
            <i className="fas fa-edit"></i>
            Editar Usuario
          </Link>

          <Link to="/users" className={styles.backBtn}>
            <i className="fas fa-arrow-left"></i>
            Volver
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información Personal</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{user.email}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>WhatsApp</span>
                <span className={styles.value}>{user.whatsapp || "No especificado"}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Rol</span>
                <span className={`${styles.value} ${styles.roleValue}`}>
                  <span className={`${styles.roleBadge} ${styles[user.role]}`}>{formatRole(user.role)}</span>
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Cupos Disponibles</span>
                <span className={styles.value}>{user.cupos}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Documentación</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tipo de Documento</span>
                <span className={styles.value}>
                  {user.documentType ? `${user.documentType.name} (${user.documentType.code})` : "No especificado"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Número de Documento</span>
                <span className={styles.value}>{user.documentNumber}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Configuración de Cuenta</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Visible en Sistema</span>
                <span className={styles.value}>
                  <span className={`${styles.statusBadge} ${user.isVisible ? styles.visible : styles.hidden}`}>
                    {user.isVisible ? "Visible" : "Oculto"}
                  </span>
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Cuenta de Google</span>
                <span className={styles.value}>
                  {user.googleId ? "Conectada" : "No conectada"}
                  {user.displayName && <span className={styles.googleName}> ({user.displayName})</span>}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Fecha de Registro</span>
                <span className={styles.value}>{formatDate(user.createdAt)}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Última Actualización</span>
                <span className={styles.value}>{formatDate(user.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.balanceCard}>
            <h4 className={styles.balanceTitle}>Balance Total</h4>
            <div className={styles.balanceAmount}>{formatCurrency(getTotalBalance().toString())}</div>
            <div className={styles.balanceDetails}>
              {user.cuentas?.length || 0} cuenta{(user.cuentas?.length || 0) !== 1 ? "s" : ""}
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>ID de Usuario</span>
              <code className={styles.statValue}>{user._id}</code>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Estado</span>
              <span className={`${styles.statValue} ${styles.statusIndicator}`}>
                <span className={`${styles.statusDot} ${user.isActive ? styles.activeDot : styles.inactiveDot}`}></span>
                {user.isActive ? "Cuenta Activa" : "Cuenta Inactiva"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.accountsSection}>
        <h3 className={styles.sectionTitle}>Cuentas Bancarias</h3>
        {user.cuentas && user.cuentas.length > 0 ? (
          <div className={styles.accountsGrid}>
            {user.cuentas.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        ) : (
          <div className={styles.noAccounts}>
            <i className="fas fa-wallet"></i>
            <p>Este usuario no tiene cuentas registradas</p>
            <Link to={`/accounts/create/${userId}`} className={styles.createAccountBtn}>
              Crear Primera Cuenta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPage;
