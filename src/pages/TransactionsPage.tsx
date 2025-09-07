import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "@/config/axiosInstance";
import styles from "./TransactionsPage.module.css";

interface Transaction {
  id: string;
  cuentaId: string;
  cuentaDestinoId?: string | null;
  cuentaOrigenId?: string | null;
  prestamoId?: string | null;
  cuotaId?: string | null;
  tipo: string;
  monto: string;
  descripcion: string;
  fecha: string;
  saldoAnterior: string;
  saldoNuevo: string;
}

interface TransactionForm {
  monto: string;
  descripcion: string;
  fecha: string;
}

interface Pagination {
  current: number;
  total: number;
  count: number;
  totalRecords: number;
}

interface Account {
  id: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo: string;
  moneda: string;
  estado: string;
}

const TransactionsPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [account] = useState<Account | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"history" | "deposit" | "withdraw">("history");

  const [depositForm, setDepositForm] = useState<TransactionForm>({
    monto: "",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  const [withdrawForm, setWithdrawForm] = useState<TransactionForm>({
    monto: "",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Fetch account info and transactions
  useEffect(() => {
    if (!accountId) {
      setError("ID de cuenta no proporcionado");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch transactions
        const response: any = await axiosInstance.get(
          `/api/progresar/transacciones/account/${accountId}?page=${currentPage}&limit=10`
        );

        if (response.data.success) {
          setTransactions(response.data.data);
          setPagination(response.data.pagination);
        }

        setError("");
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || "Error al cargar las transacciones";
        setError(errorMessage);
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, currentPage]);

  const validateForm = (form: TransactionForm, type: "deposit" | "withdraw"): boolean => {
    const errors: { [key: string]: string } = {};
    const prefix = type === "deposit" ? "deposit_" : "withdraw_";

    // Amount validation
    if (!form.monto.trim()) {
      errors[`${prefix}monto`] = "El monto es requerido";
    } else {
      const amount = parseFloat(form.monto);
      if (isNaN(amount) || amount <= 0) {
        errors[`${prefix}monto`] = "El monto debe ser un número positivo";
      }
      if (amount > 999999999) {
        errors[`${prefix}monto`] = "El monto es demasiado grande";
      }
    }

    // // Description validation
    // if (!form.descripcion.trim()) {
    //   // errors[`${prefix}descripcion`] = "La descripción es requerida";
    // } else if (form.descripcion.length > 255) {
    //   errors[`${prefix}descripcion`] = "La descripción es demasiado larga (máximo 255 caracteres)";
    // }

    // Date validation
    if (!form.fecha) {
      errors[`${prefix}fecha`] = "La fecha es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formType: "deposit" | "withdraw"
  ) => {
    const { name, value } = e.target;
    const prefix = formType === "deposit" ? "deposit_" : "withdraw_";

    // Clear validation error for this field
    if (validationErrors[`${prefix}${name}`]) {
      setValidationErrors((prev) => ({ ...prev, [`${prefix}${name}`]: "" }));
    }

    if (formType === "deposit") {
      setDepositForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setWithdrawForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTransaction = async (type: "deposit" | "withdraw") => {
    const form = type === "deposit" ? depositForm : withdrawForm;

    if (!validateForm(form, type) || !accountId) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        monto: parseFloat(form.monto),
        descripcion: form.descripcion,
        fecha: form.fecha,
      };

      const endpoint =
        type === "deposit"
          ? `/api/progresar/transacciones/deposit/${accountId}`
          : `/api/progresar/transacciones/withdraw/${accountId}`;

      const response: any = await axiosInstance.post(endpoint, payload);

      if (response.data.success) {
        // Reset form
        if (type === "deposit") {
          setDepositForm({
            monto: "",
            descripcion: "",
            fecha: new Date().toISOString().split("T")[0],
          });
        } else {
          setWithdrawForm({
            monto: "",
            descripcion: "",
            fecha: new Date().toISOString().split("T")[0],
          });
        }

        // Refresh transactions
        const transactionsResponse: any = await axiosInstance.get(
          `/api/progresar/transacciones/account/${accountId}?page=1&limit=10`
        );

        if (transactionsResponse.data.success) {
          setTransactions(transactionsResponse.data.data);
          setPagination(transactionsResponse.data.pagination);
          setCurrentPage(1);
        }

        // Switch to history tab to see the new transaction
        setActiveTab("history");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || `Error al realizar ${type === "deposit" ? "depósito" : "retiro"}`;
      setError(errorMessage);
      console.error(`Error making ${type}:`, err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatCurrency = (amount: string): string => {
    const number = parseFloat(amount);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(number);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case "deposito":
        return "fas fa-arrow-down";
      case "retiro":
        return "fas fa-arrow-up";
      case "transferencia":
        return "fas fa-exchange-alt";
      default:
        return "fas fa-money-bill-wave";
    }
  };

  const getTransactionColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "deposito":
        return styles.deposit;
      case "retiro":
        return styles.withdrawal;
      case "transferencia":
        return styles.transfer;
      default:
        return styles.other;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando transacciones...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Transacciones</h1>
        <Link to="/users" className={styles.backBtn}>
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

      {/* Account Info */}
      {account && (
        <div className={styles.accountInfo}>
          <div className={styles.accountDetails}>
            <h3>Cuenta: {account.numeroCuenta}</h3>
            <p>Saldo actual: {formatCurrency(account.saldo)}</p>
            <span className={`${styles.accountStatus} ${styles[account.estado]}`}>{account.estado.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("history")}
          className={`${styles.tab} ${activeTab === "history" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-history"></i>
          Historial
        </button>
        <button
          onClick={() => setActiveTab("deposit")}
          className={`${styles.tab} ${activeTab === "deposit" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-arrow-down"></i>
          Depósito
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`${styles.tab} ${activeTab === "withdraw" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-arrow-up"></i>
          Retiro
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* History Tab */}
        {activeTab === "history" && (
          <div className={styles.historyTab}>
            {transactions.length > 0 ? (
              <>
                <div className={styles.transactionsList}>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className={styles.transactionCard}>
                      <div className={styles.transactionHeader}>
                        <div className={styles.transactionType}>
                          <i
                            className={`${getTransactionIcon(transaction.tipo)} ${getTransactionColor(
                              transaction.tipo
                            )}`}
                          ></i>
                          <span className={styles.typeName}>
                            {transaction.tipo.charAt(0).toUpperCase() + transaction.tipo.slice(1)}
                          </span>
                        </div>
                        <div className={styles.transactionAmount}>
                          <span className={getTransactionColor(transaction.tipo)}>
                            {transaction.tipo === "deposito" ? "+" : "-"}
                            {formatCurrency(transaction.monto)}
                          </span>
                        </div>
                      </div>

                      <div className={styles.transactionDetails}>
                        <p className={styles.description}>{transaction.descripcion}</p>
                        <div className={styles.transactionMeta}>
                          <span className={styles.date}>{formatDate(transaction.fecha)}</span>
                          <span className={styles.balance}>
                            Saldo: {formatCurrency(transaction.saldoAnterior)} →{" "}
                            {formatCurrency(transaction.saldoNuevo)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.total > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={styles.pageBtn}
                    >
                      Anterior
                    </button>
                    <span className={styles.pageInfo}>
                      Página {pagination.current} de {pagination.total}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.total}
                      className={styles.pageBtn}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noTransactions}>
                <i className="fas fa-receipt"></i>
                <p>No hay transacciones registradas para esta cuenta</p>
              </div>
            )}
          </div>
        )}

        {/* Deposit Tab */}
        {activeTab === "deposit" && (
          <div className={styles.transactionForm}>
            <h3>Realizar Depósito</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTransaction("deposit");
              }}
            >
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="deposit-monto">Monto *</label>
                  <input
                    type="number"
                    id="deposit-monto"
                    name="monto"
                    value={depositForm.monto}
                    onChange={(e) => handleFormChange(e, "deposit")}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`${styles.input} ${validationErrors.deposit_monto ? styles.inputError : ""}`}
                    required
                  />
                  {validationErrors.deposit_monto && (
                    <span className={styles.errorText}>{validationErrors.deposit_monto}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="deposit-fecha">Fecha *</label>
                  <input
                    type="date"
                    id="deposit-fecha"
                    name="fecha"
                    value={depositForm.fecha}
                    onChange={(e) => handleFormChange(e, "deposit")}
                    className={`${styles.input} ${validationErrors.deposit_fecha ? styles.inputError : ""}`}
                    required
                  />
                  {validationErrors.deposit_fecha && (
                    <span className={styles.errorText}>{validationErrors.deposit_fecha}</span>
                  )}
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="deposit-descripcion">Descripción *</label>
                  <textarea
                    id="deposit-descripcion"
                    name="descripcion"
                    value={depositForm.descripcion}
                    onChange={(e) => handleFormChange(e, "deposit")}
                    placeholder="Describe el motivo del depósito..."
                    className={`${styles.textarea} ${validationErrors.deposit_descripcion ? styles.inputError : ""}`}
                    rows={3}
                    required
                  />
                  {validationErrors.deposit_descripcion && (
                    <span className={styles.errorText}>{validationErrors.deposit_descripcion}</span>
                  )}
                </div>
              </div>

              <button type="submit" className={`${styles.btn} ${styles.btnDeposit}`} disabled={submitting}>
                <i className="fas fa-arrow-down"></i>
                {submitting ? "Procesando..." : "Realizar Depósito"}
              </button>
            </form>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === "withdraw" && (
          <div className={styles.transactionForm}>
            <h3>Realizar Retiro</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTransaction("withdraw");
              }}
            >
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="withdraw-monto">Monto *</label>
                  <input
                    type="number"
                    id="withdraw-monto"
                    name="monto"
                    value={withdrawForm.monto}
                    onChange={(e) => handleFormChange(e, "withdraw")}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`${styles.input} ${validationErrors.withdraw_monto ? styles.inputError : ""}`}
                    required
                  />
                  {validationErrors.withdraw_monto && (
                    <span className={styles.errorText}>{validationErrors.withdraw_monto}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="withdraw-fecha">Fecha *</label>
                  <input
                    type="date"
                    id="withdraw-fecha"
                    name="fecha"
                    value={withdrawForm.fecha}
                    onChange={(e) => handleFormChange(e, "withdraw")}
                    className={`${styles.input} ${validationErrors.withdraw_fecha ? styles.inputError : ""}`}
                    required
                  />
                  {validationErrors.withdraw_fecha && (
                    <span className={styles.errorText}>{validationErrors.withdraw_fecha}</span>
                  )}
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="withdraw-descripcion">Descripción *</label>
                  <textarea
                    id="withdraw-descripcion"
                    name="descripcion"
                    value={withdrawForm.descripcion}
                    onChange={(e) => handleFormChange(e, "withdraw")}
                    placeholder="Describe el motivo del retiro..."
                    className={`${styles.textarea} ${validationErrors.withdraw_descripcion ? styles.inputError : ""}`}
                    rows={3}
                    required
                  />
                  {validationErrors.withdraw_descripcion && (
                    <span className={styles.errorText}>{validationErrors.withdraw_descripcion}</span>
                  )}
                </div>
              </div>

              <button type="submit" className={`${styles.btn} ${styles.btnWithdraw}`} disabled={submitting}>
                <i className="fas fa-arrow-up"></i>
                {submitting ? "Procesando..." : "Realizar Retiro"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
