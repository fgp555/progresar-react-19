// pages/TransferPage/TransferPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TransferPage.module.css";
import axiosInstance from "@/config/axiosInstance";

interface TransferForm {
  cuentaDestinoNumero: string;
  monto: string;
  descripcion: string;
}

interface Account {
  id: string;
  numeroCuenta: string;
  saldo: string | number;
  tipoCuenta: string;
  moneda: string;
  estado: string;
  fechaCreacion: string;
  usuarioId: string;
  user?: any;
}

export const TransferPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();

  const [sourceAccount, setSourceAccount] = useState<Account | null>(null);
  const [form, setForm] = useState<TransferForm>({
    cuentaDestinoNumero: "1001",
    monto: "",
    descripcion: "Transferencia a Admin",
  });
  const [displayMonto, setDisplayMonto] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Formatear números con comas
  const formatNumber = (value: string): string => {
    const cleanValue = value.replace(/[^\d.]/g, "");
    if (!cleanValue) return "";

    const parts = cleanValue.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (decimalPart !== undefined) {
      const limitedDecimals = decimalPart.slice(0, 2);
      return `${formattedInteger}.${limitedDecimals}`;
    }

    return formattedInteger;
  };

  const getNumericValue = (formattedValue: string): string => {
    return formattedValue.replace(/,/g, "");
  };

  // Función para formatear el saldo de manera segura
  const formatBalance = (saldo: string | number | undefined | null): string => {
    const balance = Number(saldo) || 0;
    return balance.toLocaleString("es-ES", { minimumFractionDigits: 2 });
  };

  // Función para obtener el saldo como número
  const getSaldoNumerico = (saldo: string | number | undefined | null): number => {
    return Number(saldo) || 0;
  };

  // Función para usar el saldo disponible
  const usarSaldoDisponible = () => {
    if (!sourceAccount) return;

    const saldoDisponible = getSaldoNumerico(sourceAccount.saldo);
    const saldoString = saldoDisponible.toString();
    const formattedSaldo = formatNumber(saldoString);

    setDisplayMonto(formattedSaldo);
    setForm((prev) => ({ ...prev, monto: saldoString }));

    // Limpiar error de validación si existe
    if (validationErrors.monto) {
      setValidationErrors((prev) => ({ ...prev, monto: "" }));
    }
  };

  // Cargar datos de la cuenta origen
  useEffect(() => {
    const fetchSourceAccount = async () => {
      try {
        setLoading(true);
        const response: any = await axiosInstance.get(`/api/progresar/cuentas/${accountId}`);

        console.log("Account API response:", response.data); // Debug log

        // La respuesta tiene la estructura { success: true, data: {...} }
        const accountData = response.data.data;

        if (!accountData) {
          throw new Error("No account data received");
        }

        console.log("Account data:", accountData); // Debug log

        setSourceAccount(accountData);
      } catch (error: any) {
        console.error("Error fetching source account:", error);
        setErrorMessage("Error al cargar la cuenta de origen");
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchSourceAccount();
    }
  }, [accountId]);

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "monto") {
      const isValidInput = /^[\d.]*$/.test(value.replace(/,/g, ""));

      if (isValidInput || value === "") {
        const formattedValue = formatNumber(value);
        const numericValue = getNumericValue(formattedValue);

        setDisplayMonto(formattedValue);
        setForm((prev) => ({ ...prev, monto: numericValue }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Limpiar errores de validación
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!form.cuentaDestinoNumero.trim()) {
      errors.cuentaDestinoNumero = "El número de cuenta destino es requerido";
    } else if (form.cuentaDestinoNumero === sourceAccount?.numeroCuenta) {
      errors.cuentaDestinoNumero = "No puedes transferir a la misma cuenta";
    }

    if (!form.monto || parseFloat(form.monto) <= 0) {
      errors.monto = "El monto debe ser mayor a 0";
    } else if (sourceAccount && parseFloat(form.monto) > getSaldoNumerico(sourceAccount.saldo)) {
      errors.monto = "Saldo insuficiente";
    }

    if (!form.descripcion.trim()) {
      errors.descripcion = "La descripción es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enviar transferencia
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const transferData = {
        cuentaOrigenId: accountId,
        cuentaDestinoNumero: form.cuentaDestinoNumero,
        monto: parseFloat(form.monto),
        descripcion: form.descripcion,
      };

      await axiosInstance.post("/api/progresar/transacciones/transfer", transferData);

      setSuccessMessage("Transferencia realizada exitosamente");

      // Limpiar formulario
      setForm({
        cuentaDestinoNumero: "",
        monto: "",
        descripcion: "",
      });
      setDisplayMonto("");

      // Actualizar saldo de la cuenta origen de manera segura
      if (sourceAccount) {
        setSourceAccount((prev) =>
          prev
            ? {
                ...prev,
                saldo: (getSaldoNumerico(prev.saldo) - parseFloat(form.monto)).toString(),
              }
            : null
        );
      }
    } catch (error: any) {
      console.error("Error en transferencia:", error);
      const errorMsg = error.response?.data?.message || "Error al procesar la transferencia";
      setErrorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  if (!sourceAccount) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No se pudo cargar la cuenta de origen</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <i className="fas fa-arrow-left"></i>
          Volver
        </button>
        <h1 className={styles.title}>Transferir Dinero</h1>
      </div>

      <div className={styles.content}>
        {/* Información de cuenta origen */}
        <div className={styles.sourceAccountCard}>
          <h3>Cuenta de Origen</h3>
          <div className={styles.accountInfo}>
            <div className={styles.accountNumber}>
              <span>Número:</span>
              <strong>{sourceAccount.numeroCuenta || "N/A"}</strong>
            </div>
            <div className={styles.accountBalance}>
              <span>Saldo disponible:</span>
              <strong className={styles.balance}>
                ${formatBalance(sourceAccount.saldo)} {sourceAccount.moneda || "COP"}
              </strong>
            </div>
          </div>
        </div>

        {/* Formulario de transferencia */}
        <div className={styles.transferForm}>
          <h3>Datos de la Transferencia</h3>

          {successMessage && (
            <div className={styles.successAlert}>
              <i className="fas fa-check-circle"></i>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className={styles.errorAlert}>
              <i className="fas fa-exclamation-circle"></i>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="cuentaDestinoNumero">Número de Cuenta Destino *</label>
              <input
                type="text"
                id="cuentaDestinoNumero"
                name="cuentaDestinoNumero"
                value={form.cuentaDestinoNumero}
                onChange={handleInputChange}
                placeholder="Ingresa el número de cuenta destino"
                className={`${styles.input} ${validationErrors.cuentaDestinoNumero ? styles.inputError : ""}`}
                required
              />
              {validationErrors.cuentaDestinoNumero && (
                <span className={styles.errorText}>{validationErrors.cuentaDestinoNumero}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="monto">Monto a Transferir *</label>
              <div className={styles.montoInputWrapper}>
                <span className={styles.currencySymbol}>$</span>
                <input
                  type="text"
                  id="monto"
                  name="monto"
                  value={displayMonto}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`${styles.input} ${styles.montoInput} ${validationErrors.monto ? styles.inputError : ""}`}
                  required
                />
                <button
                  type="button"
                  onClick={usarSaldoDisponible}
                  className={styles.useBalanceButton}
                  title="Usar saldo disponible"
                >
                  <i className="fas fa-wallet"></i>
                  Usar saldo
                </button>
              </div>
              {validationErrors.monto && <span className={styles.errorText}>{validationErrors.monto}</span>}
              <small className={styles.formatNote}>Las comas se agregan automáticamente</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={form.descripcion}
                onChange={handleInputChange}
                placeholder="Describe el motivo de la transferencia..."
                className={`${styles.textarea} ${validationErrors.descripcion ? styles.inputError : ""}`}
                rows={3}
                required
              />
              {validationErrors.descripcion && <span className={styles.errorText}>{validationErrors.descripcion}</span>}
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>
                Cancelar
              </button>
              <button type="submit" disabled={submitting} className={styles.submitButton}>
                <i className="fas fa-exchange-alt"></i>
                {submitting ? "Procesando..." : "Transferir"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
