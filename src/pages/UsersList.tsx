// UsersList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/config/axiosInstance";
import styles from "./UsersList.module.css";

// Tipos basados en la respuesta de la API
interface DocumentType {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Cuenta {
  id: string;
  usuarioId: string;
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
  password: string;
  photo: string | null;
  role: string;
  isVisible: boolean;
  isActive: boolean;
  googleId: string | null;
  displayName: string | null;
  rawGoogle: any;
  documentNumber: string;
  cupos: number;
  createdAt: string;
  updatedAt: string;
  cuentas: Cuenta[];
  documentType: DocumentType;
}

interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
  limit: number;
}

interface UsersResponse {
  success: boolean;
  pagination: Pagination;
  total: number;
  data: User[];
}

interface FilterParams {
  dateFrom?: string;
  dateTo?: string;
  sortDate?: "ASC" | "DESC";
  search?: string;
  limit?: number;
  page?: number;
}

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 10,
    sortDate: "ASC",
  });

  const fetchUsers = async (params: FilterParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();

      // Agregar parámetros solo si tienen valor
      if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
      if (params.dateTo) queryParams.append("dateTo", params.dateTo);
      if (params.sortDate) queryParams.append("sortDate", params.sortDate);
      if (params.search) queryParams.append("search", params.search);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.page) queryParams.append("page", params.page.toString());

      const response = await axiosInstance.get<UsersResponse>(`/api/progresar/usuarios?${queryParams.toString()}`);

      if (response.data.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError("Error al cargar los usuarios");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error de conexión");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(filters);
  }, []);

  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const handleSortChange = (sortOrder: "ASC" | "DESC") => {
    const newFilters = { ...filters, sortDate: sortOrder, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const formatCurrency = (amount: string): string => {
    const number = parseFloat(amount);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(number);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-CO");
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/userDetails/${userId}`);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleCreateTransaction = (accountId: string) => {
    navigate(`/transactions/${accountId}`);
  };

  const handleManageLoans = (accountId: string) => {
    navigate(`/loans/${accountId}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => fetchUsers(filters)} className={styles.retryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lista de Usuarios</h1>

        <div className={styles.controls}>
          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className={styles.searchInput}
              onChange={(e) => {
                if (e.target.value === "") {
                  handleSearch("");
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>

          <select
            value={filters.sortDate}
            onChange={(e) => handleSortChange(e.target.value as "ASC" | "DESC")}
            className={styles.sortSelect}
          >
            <option value="ASC">Más antiguos primero</option>
            <option value="DESC">Más recientes primero</option>
          </select>
        </div>
      </div>

      <div className={styles.usersGrid}>
        {users.map((user) => (
          <div key={user._id} className={styles.userCard}>
            <div className={styles.userHeader}>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>
                  {user.name} {user.lastName}
                </h3>
                <span className={`${styles.userRole} ${styles[user.role]}`}>{user.role.toUpperCase()}</span>
              </div>
              <div className={`${styles.status} ${user.isActive ? styles.active : styles.inactive}`}>
                {user.isActive ? "Activo" : "Inactivo"}
              </div>
            </div>

            <div className={styles.userDetails}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Usuario:</span>
                <span>{user.username}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Email:</span>
                <span>{user.email}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>WhatsApp:</span>
                <span>{user.whatsapp}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Documento:</span>
                <span>
                  {user.documentType.code} - {user.documentNumber}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Registro:</span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>

            {user.cuentas && user.cuentas.length > 0 && (
              <div className={styles.accountsSection}>
                <h4 className={styles.accountsTitle}>Cuentas:</h4>
                {user.cuentas.map((cuenta) => (
                  <div key={cuenta.id} className={styles.accountCard}>
                    <div className={styles.accountInfo}>
                      <span className={styles.accountNumber}>{cuenta.numeroCuenta}</span>
                      <span className={styles.accountType}>{cuenta.tipoCuenta.toUpperCase()}</span>
                    </div>
                    <div className={styles.accountBalance}>{formatCurrency(cuenta.saldo)}</div>
                    <div className={styles.accountActions}>
                      <button
                        onClick={() => handleCreateTransaction(cuenta.id)}
                        className={`${styles.actionButton} ${styles.transactionButton}`}
                        title="Crear Transacción"
                      >
                        <i className="fas fa-exchange-alt"></i>
                        <span>Transacciones</span>
                      </button>
                      <button
                        onClick={() => handleManageLoans(cuenta.id)}
                        className={`${styles.actionButton} ${styles.loanButton}`}
                        title="Gestionar Préstamos"
                      >
                        <i className="fas fa-hand-holding-usd"></i>
                        <span>Préstamos</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.userActions}>
              <button
                onClick={() => handleViewDetails(user._id)}
                className={`${styles.actionButton} ${styles.detailsButton}`}
                title="Ver Detalles"
              >
                <i className="fas fa-eye"></i>
                <span>Ver Detalles</span>
              </button>
              <button
                onClick={() => handleEditUser(user._id)}
                className={`${styles.actionButton} ${styles.editButton}`}
                title="Editar Usuario"
              >
                <i className="fas fa-edit"></i>
                <span>Editar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Página {pagination.page} de {pagination.totalPages}({pagination.totalItems} usuarios total)
          </div>

          <div className={styles.paginationControls}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={styles.pageButton}
            >
              Anterior
            </button>

            <span className={styles.currentPage}>{pagination.page}</span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasMore}
              className={styles.pageButton}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
