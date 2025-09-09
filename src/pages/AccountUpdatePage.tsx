import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/config/axiosInstance";
import styles from "./AccountUpdatePage.module.css";

interface Account {
  id: string;
  usuarioId: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo: string;
  moneda: string;
  fechaCreacion: string;
  estado: string;
  user?: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    username: string;
  };
}

interface UpdateAccountData {
  tipoCuenta: string;
  saldo: string;
  moneda: string;
  numeroCuenta: string;
  fechaCreacion: string;
  estado: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const AccountUpdatePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<UpdateAccountData>({
    tipoCuenta: "ahorro",
    saldo: "0.00",
    moneda: "COP",
    numeroCuenta: "",
    fechaCreacion: new Date().toISOString().split("T")[0],
    estado: "activa",
  });

  const accountTypes = [
    { value: "ahorro", label: "Cuenta de Ahorro", icon: "💰" },
    { value: "prestamo", label: "Cuenta de prestamo", icon: "💼" },
  ];

  const currencies = [
    { value: "COP", label: "Peso Colombiano (COP)", symbol: "$" },
    { value: "USD", label: "Dólar Americano (USD)", symbol: "$" },
  ];

  const accountStatuses = [
    { value: "activa", label: "Activa", color: "success" },
    { value: "inactiva", label: "Inactiva", color: "danger" },
    { value: "bloqueada", label: "Bloqueada", color: "warning" },
    { value: "cerrada", label: "Cerrada", color: "secondary" },
  ];

  // Fetch user accounts
  useEffect(() => {
    if (!userId) {
      setError("ID de usuario no proporcionado");
      setLoading(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response: any = await axiosInstance.get(`/api/progresar/cuentas/user/${userId}`);

        if (response.data.success) {
          setAccounts(response.data.data);

          // Auto-select first account if available
          if (response.data.data.length > 0) {
            selectAccount(response.data.data[0]);
          }
        }

        setError("");
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || "Error al cargar las cuentas";
        setError(errorMessage);
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [userId]);

  const selectAccount = (account: Account) => {
    setSelectedAccount(account);
    setFormData({
      tipoCuenta: account.tipoCuenta,
      saldo: account.saldo,
      moneda: account.moneda,
      numeroCuenta: account.numeroCuenta,
      fechaCreacion: account.fechaCreacion.split("T")[0],
      estado: account.estado,
    });
    setValidationErrors({});
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "saldo") {
      // Format currency input
      const numericValue = value.replace(/[^0-9.]/g, "");
      const parts = numericValue.split(".");
      if (parts.length > 2) {
        return; // Prevent multiple decimal points
      }
      if (parts[1] && parts[1].length > 2) {
        return; // Limit to 2 decimal places
      }
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Required fields validation
    if (!formData.numeroCuenta.trim()) {
      errors.numeroCuenta = "El número de cuenta es requerido";
    }

    if (!formData.saldo.trim()) {
      errors.saldo = "El saldo es requerido";
    } else {
      const saldoNum = parseFloat(formData.saldo);
      if (isNaN(saldoNum) || saldoNum < 0) {
        errors.saldo = "El saldo debe ser un número positivo";
      }
    }

    if (!formData.fechaCreacion.trim()) {
      errors.fechaCreacion = "La fecha de creación es requerida";
    }

    // Account number format validation (basic)
    if (formData.numeroCuenta && formData.numeroCuenta.length < 4) {
      errors.numeroCuenta = "El número de cuenta debe tener al menos 4 caracteres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedAccount) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        saldo: parseFloat(formData.saldo).toFixed(2),
      };

      const response: any = await axiosInstance.put(`/api/progresar/cuentas/${selectedAccount.id}`, payload);

      if (response.data.success) {
        setSuccess("Cuenta actualizada correctamente");

        // Update the account in the accounts list
        setAccounts((prev) => prev.map((acc) => (acc.id === selectedAccount.id ? { ...acc, ...payload } : acc)));

        // Update selected account
        setSelectedAccount((prev) => (prev ? { ...prev, ...payload } : null));
      } else {
        setError("Error al actualizar la cuenta");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al actualizar la cuenta";
      setError(errorMessage);
      console.error("Error updating account:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response: any = await axiosInstance.delete(`/api/progresar/cuentas/delete/${selectedAccount.id}`);

      if (response.data.success || response.status === 200) {
        setSuccess("Cuenta eliminada correctamente");
        
        // Remove the account from the accounts list
        const updatedAccounts = accounts.filter((acc) => acc.id !== selectedAccount.id);
        setAccounts(updatedAccounts);

        // Select the first remaining account or clear selection
        if (updatedAccounts.length > 0) {
          selectAccount(updatedAccounts[0]);
        } else {
          setSelectedAccount(null);
          // If no accounts left, redirect to user details
          setTimeout(() => {
            navigate(`/userDetails/${userId}`);
          }, 2000);
        }

        setShowDeleteModal(false);
      } else {
        setError("Error al eliminar la cuenta");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al eliminar la cuenta";
      setError(errorMessage);
      console.error("Error deleting account:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleReset = () => {
    if (selectedAccount) {
      selectAccount(selectedAccount);
    }
  };

  const formatCurrency = (amount: string): string => {
    if (!amount) return "";
    const number = parseFloat(amount);
    if (isNaN(number)) return amount;

    const currency = currencies.find((c) => c.value === formData.moneda);
    const symbol = currency?.symbol || "$";

    return `${symbol}${number.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "activa":
        return styles.active;
      case "inactiva":
        return styles.inactive;
      case "bloqueada":
        return styles.blocked;
      case "cerrada":
        return styles.closed;
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando cuentas...</p>
      </div>
    );
  }

  if (error && accounts.length === 0) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <Link to="/users" className={styles.backLink}>
          Volver a usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Editar Cuentas</h1>
          {selectedAccount?.user && (
            <div className={styles.userInfo}>
              <span className={styles.userLabel}>Usuario:</span>
              <span className={styles.userName}>
                {selectedAccount.user.name} {selectedAccount.user.lastName}
              </span>
              <span className={styles.userEmail}>({selectedAccount.user.email})</span>
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <Link to={`/userDetails/${userId}`} className={styles.backBtn}>
            <i className="fas fa-arrow-left"></i>
            Volver al Usuario
          </Link>
          <Link to="/users" className={styles.usersBtn}>
            <i className="fas fa-users"></i>
            Usuarios
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        {/* Accounts List Sidebar */}
        <div className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Cuentas del Usuario</h3>

          {accounts.length > 0 ? (
            <div className={styles.accountsList}>
              {accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => selectAccount(account)}
                  className={`${styles.accountItem} ${
                    selectedAccount?.id === account.id ? styles.selectedAccount : ""
                  }`}
                >
                  <div className={styles.accountHeader}>
                    <span className={styles.accountNumber}>{account.numeroCuenta}</span>
                    <span className={`${styles.accountStatus} ${getStatusColor(account.estado)}`}>
                      {account.estado.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.accountInfo}>
                    <span className={styles.accountType}>
                      {accountTypes.find((t) => t.value === account.tipoCuenta)?.label}
                    </span>
                    <span className={styles.accountBalance}>
                      {formatCurrency(account.saldo)} {account.moneda}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noAccounts}>
              <p>Este usuario no tiene cuentas registradas</p>
              <Link to={`/accounts/create/${userId}`} className={styles.createAccountBtn}>
                <i className="fas fa-plus"></i>
                Crear Primera Cuenta
              </Link>
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div className={styles.mainContent}>
          {selectedAccount ? (
            <>
              {error && (
                <div className={styles.errorMessage}>
                  <i className="fas fa-exclamation-triangle"></i>
                  {error}
                </div>
              )}

              {success && (
                <div className={styles.successMessage}>
                  <i className="fas fa-check-circle"></i>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formHeader}>
                  <h3>Editar Cuenta: {selectedAccount.numeroCuenta}</h3>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className={`${styles.btn} ${styles.btnDanger}`}
                    disabled={saving || deleting}
                    title="Eliminar cuenta"
                  >
                    <i className="fas fa-trash"></i>
                    Eliminar Cuenta
                  </button>
                </div>

                <div className={styles.formGrid}>
                  {/* Account Information Section */}
                  <div className={styles.sectionHeader}>
                    <h4>Información de la Cuenta</h4>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="tipoCuenta">Tipo de Cuenta *</label>
                    <select
                      id="tipoCuenta"
                      name="tipoCuenta"
                      value={formData.tipoCuenta}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      {accountTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="numeroCuenta">Número de Cuenta *</label>
                    <input
                      type="text"
                      id="numeroCuenta"
                      name="numeroCuenta"
                      value={formData.numeroCuenta}
                      onChange={handleInputChange}
                      placeholder="Ej: 1234-5678-9012"
                      className={`${styles.input} ${validationErrors.numeroCuenta ? styles.inputError : ""}`}
                      required
                    />
                    {validationErrors.numeroCuenta && (
                      <span className={styles.errorText}>{validationErrors.numeroCuenta}</span>
                    )}
                  </div>

                  {/* Financial Information Section */}
                  <div className={styles.sectionHeader}>
                    <h4>Información Financiera</h4>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="saldo">Saldo *</label>
                    <div className={styles.currencyInput}>
                      <input
                        type="text"
                        id="saldo"
                        name="saldo"
                        value={formData.saldo}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className={`${styles.input} ${validationErrors.saldo ? styles.inputError : ""}`}
                        required
                      />
                      <span className={styles.currencySymbol}>
                        {currencies.find((c) => c.value === formData.moneda)?.symbol || "$"}
                      </span>
                    </div>
                    {validationErrors.saldo && <span className={styles.errorText}>{validationErrors.saldo}</span>}
                    {formData.saldo && <div className={styles.preview}>Saldo: {formatCurrency(formData.saldo)}</div>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="moneda">Moneda *</label>
                    <select
                      id="moneda"
                      name="moneda"
                      value={formData.moneda}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.symbol} {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Configuration Section */}
                  <div className={styles.sectionHeader}>
                    <h4>Configuración</h4>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="fechaCreacion">Fecha de Creación *</label>
                    <input
                      type="date"
                      id="fechaCreacion"
                      name="fechaCreacion"
                      value={formData.fechaCreacion}
                      onChange={handleInputChange}
                      className={`${styles.input} ${validationErrors.fechaCreacion ? styles.inputError : ""}`}
                      required
                    />
                    {validationErrors.fechaCreacion && (
                      <span className={styles.errorText}>{validationErrors.fechaCreacion}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="estado">Estado de la Cuenta *</label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      {accountStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={handleReset}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    disabled={saving || deleting}
                  >
                    <i className="fas fa-undo"></i>
                    Restablecer
                  </button>

                  <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving || deleting}>
                    <i className="fas fa-save"></i>
                    {saving ? "Guardando..." : "Actualizar Cuenta"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className={styles.noSelection}>
              <i className="fas fa-hand-pointer"></i>
              <p>Selecciona una cuenta de la lista para editarla</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Confirmar Eliminación</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.modalClose}
                disabled={deleting}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.warningIcon}>
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <p>
                ¿Estás seguro de que deseas eliminar la cuenta{" "}
                <strong>{selectedAccount?.numeroCuenta}</strong>?
              </p>
              <p className={styles.warningText}>
                Esta acción no se puede deshacer. Se eliminarán permanentemente todos los datos
                asociados a esta cuenta.
              </p>

              {selectedAccount && (
                <div className={styles.accountSummary}>
                  <h4>Resumen de la cuenta:</h4>
                  <ul>
                    <li><strong>Número:</strong> {selectedAccount.numeroCuenta}</li>
                    <li><strong>Tipo:</strong> {accountTypes.find(t => t.value === selectedAccount.tipoCuenta)?.label}</li>
                    <li><strong>Saldo:</strong> {formatCurrency(selectedAccount.saldo)} {selectedAccount.moneda}</li>
                    <li><strong>Estado:</strong> {selectedAccount.estado}</li>
                  </ul>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`${styles.btn} ${styles.btnSecondary}`}
                disabled={deleting}
              >
                <i className="fas fa-times"></i>
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className={`${styles.btn} ${styles.btnDanger}`}
                disabled={deleting}
              >
                <i className="fas fa-trash"></i>
                {deleting ? "Eliminando..." : "Confirmar Eliminación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountUpdatePage;