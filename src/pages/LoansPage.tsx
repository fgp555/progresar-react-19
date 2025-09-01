import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "@/config/axiosInstance";
import styles from "./LoansPage.module.css";

interface LoanInstallment {
  id: string;
  numeroCuota: number;
  monto: string;
  fechaVencimiento: string;
  fechaPago?: string | null;
  estado: "PENDIENTE" | "PAGADA" | "VENCIDA";
}

interface Account {
  id: string;
  usuarioId: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo: string;
  moneda: string;
  fechaCreacion: string;
  estado: string;
}

interface Loan {
  id: string;
  cuentaId: string;
  montoPrincipal: string;
  numeroCuotas: number;
  montoCuota: string;
  montoTotal: string;
  interesTotal: string;
  cuotasPagadas: number;
  fechaVencimiento: string;
  fechaCompletado?: string | null;
  estado: "ACTIVO" | "COMPLETADO" | "VENCIDO";
  descripcion: string;
  scoreAprobacion: number;
  ratioCapacidadPago: string;
  fechaCreacion: string;
  cuotas: LoanInstallment[];
}

interface CreateLoanForm {
  monto: string;
  numeroCuotas: number;
  descripcion: string;
  fechaCreacion: string;
}

interface PayInstallmentForm {
  numeroCuotas: number;
  fechaPago: string;
}

interface LoanCalculation {
  montoPrincipal: number;
  numeroCuotas: number;
  montoCuota: number;
  montoTotal: number;
  interesTotal: number;
  tasaInteres: string;
}

const LoansPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"loans" | "request" | "calculate">("loans");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);

  const [createLoanForm, setCreateLoanForm] = useState<CreateLoanForm>({
    monto: "",
    numeroCuotas: 1,
    descripcion: "",
    fechaCreacion: new Date().toISOString().split("T")[0],
  });

  const [payForm, setPayForm] = useState<PayInstallmentForm>({
    numeroCuotas: 1,
    fechaPago: new Date().toISOString().split("T")[0],
  });

  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Fetch loans and account info
  useEffect(() => {
    if (!accountId) {
      setError("ID de cuenta no proporcionado");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch loans
        const loansResponse: any = await axiosInstance.get(`/api/progresar/prestamos/account/${accountId}`);

        if (loansResponse.data.success) {
          setLoans(loansResponse.data.data);
        }

        // Try to get account info directly first
        try {
          const accountResponse: any = await axiosInstance.get(`/api/progresar/cuentas/${accountId}`);
          if (accountResponse.data.success) {
            setAccount(accountResponse.data.data);
          }
        } catch (accountErr) {
          // If direct account fetch fails, we'll work without account info for now
          console.warn("Could not fetch account details:", accountErr);
        }

        setError("");
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || "Error al cargar los datos";
        setError(errorMessage);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  const validateCreateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!createLoanForm.monto || createLoanForm.monto.toString().trim() === "") {
      errors.monto = "El monto es requerido";
    } else {
      const amount = parseFloat(createLoanForm.monto.toString());
      if (isNaN(amount) || amount <= 0) {
        errors.monto = "El monto debe ser un número positivo";
      } else if (account) {
        // Validar que el monto no exceda el doble del saldo
        const maxAmount = parseFloat(account.saldo) * 2;
        if (amount > maxAmount) {
          errors.monto = `El monto máximo permitido es ${formatCurrency(maxAmount.toString())} (2x su saldo actual)`;
        }
      }
    }

    // if (createLoanForm.numeroCuotas < 1 || createLoanForm.numeroCuotas > 6) {
    //   errors.numeroCuotas = "El número de cuotas debe ser entre 1 y 6";
    // }

    // if (!createLoanForm.descripcion.trim()) {
    //   errors.descripcion = "La descripción es requerida";
    // }

    if (!createLoanForm.fechaCreacion) {
      errors.fechaCreacion = "La fecha de creación es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // if (payForm.numeroCuotas < 1 || payForm.numeroCuotas > 6) {
    //   errors.numeroCuotas = "El número de cuotas debe ser entre 1 y 6";
    // }

    if (!payForm.fechaPago) {
      errors.fechaPago = "La fecha de pago es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (type === "number") {
      const numValue = parseInt(value) || 1;
      setCreateLoanForm((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setCreateLoanForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePayFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (type === "number") {
      const numValue = parseInt(value) || 1;
      setPayForm((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setPayForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateLoan = async () => {
    if (!createLoanForm.monto || createLoanForm.numeroCuotas < 1 || createLoanForm.numeroCuotas > 6) {
      setError("Por favor ingresa un monto válido y número de cuotas entre 1 y 6");
      return;
    }

    try {
      const response: any = await axiosInstance.post("/api/progresar/prestamos/calculate", {
        monto: parseFloat(createLoanForm.monto.toString()),
        numeroCuotas: createLoanForm.numeroCuotas,
      });

      if (response.data.success) {
        setCalculation(response.data.data);
        setError("");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al calcular el préstamo";
      setError(errorMessage);
      console.error("Error calculating loan:", err);
    }
  };

  const createLoan = async () => {
    if (!validateCreateForm() || !accountId) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        monto: parseFloat(createLoanForm.monto),
        numeroCuotas: createLoanForm.numeroCuotas,
        descripcion: createLoanForm.descripcion,
        fechaCreacion: createLoanForm.fechaCreacion,
      };

      const response: any = await axiosInstance.post(`/api/progresar/prestamos/account/${accountId}`, payload);

      if (response.data.success) {
        // Reset form
        setCreateLoanForm({
          monto: "",
          numeroCuotas: 1,
          descripcion: "",
          fechaCreacion: new Date().toISOString().split("T")[0],
        });
        setCalculation(null);

        // Refresh loans
        const loansResponse: any = await axiosInstance.get(`/api/progresar/prestamos/account/${accountId}`);
        if (loansResponse.data.success) {
          setLoans(loansResponse.data.data);
        }

        // Switch to loans tab
        setActiveTab("loans");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al crear el préstamo";
      setError(errorMessage);
      console.error("Error creating loan:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const payInstallment = async () => {
    if (!validatePayForm() || !selectedLoan) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        numeroCuotas: payForm.numeroCuotas,
        fechaPago: payForm.fechaPago,
      };

      const response: any = await axiosInstance.post(`/api/progresar/prestamos/pay/${selectedLoan.id}`, payload);

      if (response.data.success) {
        // Reset form and close modal
        setPayForm({
          numeroCuotas: 1,
          fechaPago: new Date().toISOString().split("T")[0],
        });
        setShowPayModal(false);
        setSelectedLoan(null);

        // Refresh loans
        const loansResponse: any = await axiosInstance.get(`/api/progresar/prestamos/account/${accountId}`);
        if (loansResponse.data.success) {
          setLoans(loansResponse.data.data);
        }
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al pagar la cuota";
      setError(errorMessage);
      console.error("Error paying installment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openPayModal = (loan: Loan) => {
    setSelectedLoan(loan);
    const pendingInstallments = loan.cuotas.filter((c) => c.estado === "PENDIENTE").length;
    setPayForm({
      numeroCuotas: Math.min(1, pendingInstallments),
      fechaPago: new Date().toISOString().split("T")[0],
    });
    setShowPayModal(true);
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
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ACTIVO":
        return styles.active;
      case "COMPLETADO":
        return styles.completed;
      case "VENCIDO":
        return styles.overdue;
      case "PENDIENTE":
        return styles.pending;
      case "PAGADA":
        return styles.paid;
      default:
        return "";
    }
  };

  const getProgressPercentage = (loan: Loan): number => {
    return (loan.cuotasPagadas / loan.numeroCuotas) * 100;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando préstamos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Préstamos</h1>
        <Link to="/accounts" className={styles.backBtn}>
          <i className="fas fa-arrow-left"></i>
          Volver a Cuentas
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
            <p>Monto máximo préstamo: {formatCurrency((parseFloat(account.saldo) * 2).toString())}</p>
            <span className={`${styles.accountStatus} ${styles[account.estado]}`}>{account.estado.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("loans")}
          className={`${styles.tab} ${activeTab === "loans" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-list"></i>
          Mis Préstamos
        </button>
        <button
          onClick={() => setActiveTab("calculate")}
          className={`${styles.tab} ${activeTab === "calculate" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-calculator"></i>
          Calculadora
        </button>
        <button
          onClick={() => setActiveTab("request")}
          className={`${styles.tab} ${activeTab === "request" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-plus-circle"></i>
          Asignar Préstamo
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Loans List Tab */}
        {activeTab === "loans" && (
          <div className={styles.loansTab}>
            {loans.length > 0 ? (
              <div className={styles.loansList}>
                {loans.map((loan) => (
                  <div key={loan.id} className={styles.loanCard}>
                    <div className={styles.loanHeader}>
                      <div className={styles.loanInfo}>
                        <h3 className={styles.loanTitle}>{formatCurrency(loan.montoPrincipal)}</h3>
                        <span className={`${styles.loanStatus} ${getStatusColor(loan.estado)}`}>{loan.estado}</span>
                      </div>
                      <div className={styles.loanProgress}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${getProgressPercentage(loan)}%` }}
                          ></div>
                        </div>
                        <span className={styles.progressText}>
                          {loan.cuotasPagadas}/{loan.numeroCuotas} cuotas
                        </span>
                      </div>
                    </div>

                    <div className={styles.loanDetails}>
                      <div className={styles.detailRow}>
                        <span>Descripción:</span>
                        <span>{loan.descripcion}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Cuota mensual:</span>
                        <span>{formatCurrency(loan.montoCuota)}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Total a pagar:</span>
                        <span>{formatCurrency(loan.montoTotal)}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Interés total:</span>
                        <span>{formatCurrency(loan.interesTotal)}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Score aprobación:</span>
                        <span>{loan.scoreAprobacion}/100</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Vencimiento:</span>
                        <span>{formatDate(loan.fechaVencimiento)}</span>
                      </div>
                    </div>

                    {loan.estado === "ACTIVO" && (
                      <div className={styles.loanActions}>
                        <button onClick={() => openPayModal(loan)} className={styles.payButton}>
                          <i className="fas fa-credit-card"></i>
                          Pagar Cuotas
                        </button>
                      </div>
                    )}

                    {/* Installments */}
                    <div className={styles.installments}>
                      <h4>Cronograma de Cuotas</h4>
                      <div className={styles.installmentsList}>
                        {loan.cuotas.map((installment) => (
                          <div key={installment.id} className={styles.installmentItem}>
                            <div className={styles.installmentInfo}>
                              <span className={styles.installmentNumber}>Cuota {installment.numeroCuota}</span>
                              <span className={styles.installmentAmount}>{formatCurrency(installment.monto)}</span>
                            </div>
                            <div className={styles.installmentMeta}>
                              <span className={styles.installmentDate}>
                                Vence: {formatDate(installment.fechaVencimiento)}
                              </span>
                              <span className={`${styles.installmentStatus} ${getStatusColor(installment.estado)}`}>
                                {installment.estado}
                                {installment.fechaPago && (
                                  <span className={styles.payDate}> (Pagada: {formatDate(installment.fechaPago)})</span>
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noLoans}>
                <i className="fas fa-hand-holding-usd"></i>
                <p>No tienes préstamos registrados</p>
                <button onClick={() => setActiveTab("request")} className={styles.requestLoanBtn}>
                  Solicitar mi primer préstamo
                </button>
              </div>
            )}
          </div>
        )}

        {/* Calculate Tab */}
        {activeTab === "calculate" && (
          <div className={styles.calculateTab}>
            <h3>Calculadora de Préstamos</h3>
            <p>Simula tu préstamo para conocer las cuotas y el total a pagar</p>

            <div className={styles.calculatorForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Monto solicitado</label>
                  <input
                    type="text"
                    name="monto"
                    value={createLoanForm.monto}
                    onChange={handleCreateFormChange}
                    placeholder="Ej: 1000000"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Número de cuotas</label>
                  <select
                    name="numeroCuotas"
                    value={createLoanForm.numeroCuotas}
                    onChange={handleCreateFormChange}
                    className={styles.select}
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} cuota{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={calculateLoan} className={styles.calculateButton}>
                <i className="fas fa-calculator"></i>
                Calcular Préstamo
              </button>
            </div>

            {calculation && (
              <div className={styles.calculationResult}>
                <h4>Resultado de la Simulación</h4>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Monto Principal:</span>
                    <span className={styles.resultValue}>{formatCurrency(calculation.montoPrincipal.toString())}</span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Cuota Mensual:</span>
                    <span className={styles.resultValue}>{formatCurrency(calculation.montoCuota.toString())}</span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Total a Pagar:</span>
                    <span className={styles.resultValue}>{formatCurrency(calculation.montoTotal.toString())}</span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Interés Total:</span>
                    <span className={styles.resultValue}>{formatCurrency(calculation.interesTotal.toString())}</span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Tasa de Interés:</span>
                    <span className={styles.resultValue}>{calculation.tasaInteres}</span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Número de Cuotas:</span>
                    <span className={styles.resultValue}>{calculation.numeroCuotas}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Request Loan Tab */}
        {activeTab === "request" && (
          <div className={styles.requestTab}>
            <h3>Asignar Préstamo</h3>
            <p>Complete los datos para solicitar su préstamo</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createLoan();
              }}
              className={styles.loanForm}
            >
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="monto">Monto solicitado *</label>
                  <input
                    type="text"
                    id="monto"
                    name="monto"
                    value={createLoanForm.monto}
                    onChange={handleCreateFormChange}
                    placeholder="Ej: 1000000"
                    className={`${styles.input} ${validationErrors.monto ? styles.inputError : ""}`}
                    required
                  />
                  {validationErrors.monto && <span className={styles.errorText}>{validationErrors.monto}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="numeroCuotas">Número de cuotas *</label>
                  <input
                    type="number"
                    id="numeroCuotas"
                    name="numeroCuotas"
                    value={createLoanForm.numeroCuotas}
                    onChange={handleCreateFormChange}
                    className={`${styles.input} ${validationErrors.numeroCuotas ? styles.inputError : ""}`}
                    required
                    min={1}
                    max={120} // 👈 ajusta según tus reglas de negocio
                    placeholder="Ej: 6"
                  />
                  {validationErrors.numeroCuotas && (
                    <span className={styles.errorText}>{validationErrors.numeroCuotas}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="fechaCreacion">Fecha de solicitud *</label>
                  <input
                    type="date"
                    id="fechaCreacion"
                    name="fechaCreacion"
                    value={createLoanForm.fechaCreacion}
                    onChange={handleCreateFormChange}
                    className={`${styles.input} ${validationErrors.fechaCreacion ? styles.inputError : ""}`}
                    required
                  />
                  {validationErrors.fechaCreacion && (
                    <span className={styles.errorText}>{validationErrors.fechaCreacion}</span>
                  )}
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="descripcion">Descripción del préstamo *</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={createLoanForm.descripcion}
                    onChange={handleCreateFormChange}
                    placeholder="Describa el motivo del préstamo..."
                    className={`${styles.textarea} ${validationErrors.descripcion ? styles.inputError : ""}`}
                    rows={3}
                  />
                  {validationErrors.descripcion && (
                    <span className={styles.errorText}>{validationErrors.descripcion}</span>
                  )}
                </div>
              </div>

              <button type="submit" className={styles.submitButton} disabled={submitting}>
                <i className="fas fa-paper-plane"></i>
                {submitting ? "Procesando solicitud..." : "Asignar Préstamo"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Pay Installment Modal */}
      {showPayModal && selectedLoan && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Pagar Cuotas - Préstamo</h3>
              <button onClick={() => setShowPayModal(false)} className={styles.modalClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.loanSummary}>
                <p>
                  <strong>Monto:</strong> {formatCurrency(selectedLoan.montoPrincipal)}
                </p>
                <p>
                  <strong>Cuotas pendientes:</strong> {selectedLoan.numeroCuotas - selectedLoan.cuotasPagadas}
                </p>
                <p>
                  <strong>Cuota mensual:</strong> {formatCurrency(selectedLoan.montoCuota)}
                </p>
              </div>

              <div className={styles.payForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="pay-numeroCuotas">Número de cuotas a pagar</label>
                  <select
                    id="pay-numeroCuotas"
                    name="numeroCuotas"
                    value={payForm.numeroCuotas}
                    onChange={handlePayFormChange}
                    className={`${styles.select} ${validationErrors.numeroCuotas ? styles.inputError : ""}`}
                  >
                    {Array.from(
                      { length: Math.min(6, selectedLoan.numeroCuotas - selectedLoan.cuotasPagadas) },
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} cuota{num > 1 ? "s" : ""} -{" "}
                        {formatCurrency((parseFloat(selectedLoan.montoCuota) * num).toString())}
                      </option>
                    ))}
                  </select>
                  {validationErrors.numeroCuotas && (
                    <span className={styles.errorText}>{validationErrors.numeroCuotas}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="pay-fechaPago">Fecha de pago</label>
                  <input
                    type="date"
                    id="pay-fechaPago"
                    name="fechaPago"
                    value={payForm.fechaPago}
                    onChange={handlePayFormChange}
                    className={`${styles.input} ${validationErrors.fechaPago ? styles.inputError : ""}`}
                  />
                  {validationErrors.fechaPago && <span className={styles.errorText}>{validationErrors.fechaPago}</span>}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowPayModal(false)} className={styles.cancelButton} disabled={submitting}>
                Cancelar
              </button>
              <button onClick={payInstallment} className={styles.confirmButton} disabled={submitting}>
                <i className="fas fa-credit-card"></i>
                {submitting ? "Procesando..." : "Pagar Cuotas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;
