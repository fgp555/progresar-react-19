import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "@/config/axiosInstance";
import styles from "./AccountCreate.module.css";

interface CreateAccountData {
  tipoCuenta: string;
  saldo: string;
  moneda: string;
  numeroCuenta: string;
  fechaCreacion: string;
  estado: string;
}

interface User {
  _id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const AccountCreate: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [formData, setFormData] = useState<CreateAccountData>({
    tipoCuenta: "ahorro",
    saldo: "0.00",
    moneda: "COP",
    numeroCuenta: "",
    fechaCreacion: new Date().toISOString().split("T")[0],
    estado: "activa",
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const accountTypes = [
    { value: "ahorro", label: "Cuenta de Ahorro", icon: "💰" },
    { value: "corriente", label: "Cuenta Corriente", icon: "💳" },
    { value: "nomina", label: "Cuenta Nómina", icon: "💼" },
  ];

  const currencies = [
    { value: "COP", label: "Peso Colombiano (COP)", symbol: "$" },
    { value: "USD", label: "Dólar Americano (USD)", symbol: "$" },
    { value: "EUR", label: "Euro (EUR)", symbol: "€" },
  ];

  const accountStatuses = [
    { value: "activa", label: "Activa", color: "success" },
    { value: "inactiva", label: "Inactiva", color: "danger" },
    { value: "bloqueada", label: "Bloqueada", color: "warning" },
    { value: "cerrada", label: "Cerrada", color: "secondary" },
  ];

  // Fetch user data
  useEffect(() => {
    if (!userId) {
      setError("ID de usuario no proporcionado");
      setLoadingUser(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response: any = await axiosInstance.get(`/api/progresar/usuarios/${userId}`);
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setError("Usuario no encontrado");
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || "Error al cargar usuario";
        setError(errorMessage);
        console.error("Error fetching user:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Generate account number
  const generateAccountNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    const accountNumber = `${timestamp}-${random}`;
    setFormData((prev) => ({ ...prev, numeroCuenta: accountNumber }));
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
      errors.saldo = "El saldo inicial es requerido";
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

    if (!validateForm() || !userId) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        saldo: parseFloat(formData.saldo).toFixed(2),
      };

      const response: any = await axiosInstance.post(`/api/progresar/cuentas/user/${userId}`, payload);

      if (response.data.success) {
        // Navigate back to user details
        navigate(`/userDetails/${userId}`);
      } else {
        setError("Error al crear la cuenta");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al crear la cuenta";
      setError(errorMessage);
      console.error("Error creating account:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      tipoCuenta: "ahorro",
      saldo: "0.00",
      moneda: "COP",
      numeroCuenta: "",
      fechaCreacion: new Date().toISOString().split("T")[0],
      estado: "activa",
    });
    setValidationErrors({});
    setError("");
  };

  const formatCurrency = (amount: string): string => {
    if (!amount) return "";
    const number = parseFloat(amount);
    if (isNaN(number)) return amount;

    const currency = currencies.find((c) => c.value === formData.moneda);
    const symbol = currency?.symbol || "$";

    return `${symbol}${number.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loadingUser) {
    return (
      <div className={styles.loading}>
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  if (error && !user) {
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
          <h1 className={styles.title}>Crear Nueva Cuenta</h1>
          {user && (
            <div className={styles.userInfo}>
              <span className={styles.userLabel}>Para:</span>
              <span className={styles.userName}>
                {user.name} {user.lastName}
              </span>
              <span className={styles.userEmail}>({user.email})</span>
            </div>
          )}
        </div>
        <Link to={userId ? `/userDetails/${userId}` : "/users"} className={styles.backBtn}>
          <i className="fas fa-arrow-left"></i>
          Volver
        </Link>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Account Information Section */}
          <div className={styles.sectionHeader}>
            <h3>Información de la Cuenta</h3>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipoCuenta" className={styles.label}>
              Tipo de Cuenta *
            </label>
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
            <label htmlFor="numeroCuenta" className={styles.label}>
              Número de Cuenta *
            </label>
            <div className={styles.inputGroup}>
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
              <button
                type="button"
                onClick={generateAccountNumber}
                className={styles.generateBtn}
                title="Generar número automático"
              >
                <i className="fas fa-dice"></i>
              </button>
            </div>
            {validationErrors.numeroCuenta && <span className={styles.errorText}>{validationErrors.numeroCuenta}</span>}
            <small className={styles.helpText}>Puede generar un número automático o ingresar uno personalizado</small>
          </div>

          {/* Financial Information Section */}
          <div className={styles.sectionHeader}>
            <h3>Información Financiera</h3>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="saldo" className={styles.label}>
              Saldo Inicial *
            </label>
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
            <label htmlFor="moneda" className={styles.label}>
              Moneda *
            </label>
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
            <h3>Configuración</h3>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fechaCreacion" className={styles.label}>
              Fecha de Creación *
            </label>
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
            <label htmlFor="estado" className={styles.label}>
              Estado de la Cuenta *
            </label>
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

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleReset}
            className={`${styles.btn} ${styles.btnSecondary}`}
            disabled={loading}
          >
            <i className="fas fa-undo"></i>
            Limpiar Formulario
          </button>

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
            <i className="fas fa-plus-circle"></i>
            {loading ? "Creando Cuenta..." : "Crear Cuenta"}
          </button>
        </div>
      </form>

      {/* Preview Card */}
      <div className={styles.preview}>
        <h3>Vista Previa de la Cuenta</h3>
        <div className={styles.previewCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardType}>
              {accountTypes.find((t) => t.value === formData.tipoCuenta)?.icon}
              {accountTypes.find((t) => t.value === formData.tipoCuenta)?.label}
            </span>
            <span className={`${styles.cardStatus} ${styles[formData.estado]}`}>
              {accountStatuses.find((s) => s.value === formData.estado)?.label}
            </span>
          </div>
          <div className={styles.cardNumber}>{formData.numeroCuenta || "XXXX-XXXX-XXXX"}</div>
          <div className={styles.cardBalance}>
            {formatCurrency(formData.saldo)} {formData.moneda}
          </div>
          <div className={styles.cardDate}>Creada: {formData.fechaCreacion || "Fecha no especificada"}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountCreate;
