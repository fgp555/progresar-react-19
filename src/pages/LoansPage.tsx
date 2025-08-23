// src\pages\LoansPage.tsx

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../components/UI";
import { useParams } from "react-router-dom";
import { useLoans } from "../hooks/useLoans";
import type { CalculateLoanDto, CreateLoanDto, PayInstallmentDto } from "../types";
import "./LoansPage.css";
import { useAuth } from "@/auth/hooks/useAuth";

const LoansPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { loans, loading, error, calculation, fetchAccountLoans, calculateLoan, requestLoan, payInstallment } =
    useLoans();

  // State for modals and forms
  const [showCalculateModal, setShowCalculateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  // Form states
  const [calculateForm, setCalculateForm] = useState<CalculateLoanDto>({
    monto: 0,
    numeroCuotas: 6,
  });

  const [requestForm, setRequestForm] = useState<CreateLoanDto>({
    monto: 0,
    numeroCuotas: 6,
    descripcion: "",
  });

  const [paymentForm, setPaymentForm] = useState<PayInstallmentDto>({
    numeroCuotas: 1,
  });

  // Load loans on component mount
  useEffect(() => {
    if (accountId) {
      fetchAccountLoans(accountId);
    }
  }, [accountId, fetchAccountLoans]);

  // Handle loan calculation
  const handleCalculateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await calculateLoan(calculateForm);
    } catch (err) {
      console.error("Error calculating loan:", err);
    }
  };

  // Handle loan request
  const handleRequestLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return;

    try {
      await requestLoan(accountId, requestForm);
      setShowRequestModal(false);
      setRequestForm({
        monto: 0,
        numeroCuotas: 6,
        descripcion: "",
      });
    } catch (err) {
      console.error("Error requesting loan:", err);
    }
  };

  // Handle installment payment
  const handlePayInstallment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanId) return;

    try {
      await payInstallment(selectedLoanId, paymentForm);
      setShowPaymentModal(false);
      setPaymentForm({ numeroCuotas: 1 });
      setSelectedLoanId(null);
    } catch (err) {
      console.error("Error paying installment:", err);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "COL",
    }).format(amount);
  };

  // Get loan status color
  const getLoanStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "var(--success-500)";
      case "completado":
        return "var(--secondary-500)";
      case "cancelado":
        return "var(--error-500)";
      default:
        return "var(--secondary-500)";
    }
  };

  // Calculate remaining balance
  const getRemainingBalance = (loan: any) => {
    const paidInstallments = loan.cuotasPagadas || 0;
    const remainingInstallments = loan.numeroCuotas - paidInstallments;
    return remainingInstallments * loan.montoCuota;
  };

  const { hasRole } = useAuth();

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Préstamos</h1>
        <p className="page-subtitle">Sistema de préstamos con evaluación crediticia</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <div className="alert-title">Error</div>
          <div className="alert-message">{error}</div>
        </div>
      )}

      <div className="grid grid-2">
        <Card>
          <CardHeader title="Solicitar Préstamo" subtitle="Evaluación y aprobación de préstamos" />
          <CardBody>
            <div style={{ textAlign: "center", padding: "var(--spacing-6)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--spacing-4)" }}>🏦</div>
              <p style={{ color: "var(--secondary-600)", marginBottom: "var(--spacing-4)" }}>
                Solicita un préstamo personalizado según tus necesidades
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                <button className="btn btn-primary" onClick={() => setShowCalculateModal(true)} disabled={loading}>
                  {loading ? <span className="loading">Calculando...</span> : "Calcular Préstamo"}
                </button>
                {hasRole("admin") && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowRequestModal(true)}
                    disabled={loading || !accountId}
                  >
                    Solicitar Préstamo
                  </button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
        {hasRole("admin") && (
          <Card>
            <CardHeader title="Pagar Cuotas" subtitle="Gestión de pagos de préstamos" />
            <CardBody>
              <div style={{ textAlign: "center", padding: "var(--spacing-6)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "var(--spacing-4)" }}>💳</div>
                <p style={{ color: "var(--secondary-600)", marginBottom: "var(--spacing-4)" }}>
                  Realiza pagos de cuotas de tus préstamos activos
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                  <button
                    className="btn btn-success"
                    disabled={loans.filter((loan) => loan.estado.toLowerCase() === "activo").length === 0}
                    onClick={() => {
                      const activeLoan = loans.find((loan) => loan.estado.toLowerCase() === "activo");
                      if (activeLoan) {
                        setSelectedLoanId(activeLoan.id);
                        setShowPaymentModal(true);
                      }
                    }}
                  >
                    Pagar Cuota
                  </button>
                  {/* <button className="btn btn-secondary">Ver Cronograma</button> */}
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader title="Préstamos Activos" subtitle={`${loans.length} préstamos en el sistema`} />
        <CardBody>
          {loading ? (
            <div className="empty-state">
              <div className="loading">Cargando préstamos...</div>
            </div>
          ) : loans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-title">No tienes préstamos</div>
              <div className="empty-description">Solicita tu primer préstamo para comenzar</div>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Monto Principal</th>
                    <th>Cuotas</th>
                    <th>Cuota Mensual</th>
                    <th>Estado</th>
                    <th>Cuotas Pagadas</th>
                    <th>Saldo Pendiente</th>
                    <th>Score</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td style={{ fontFamily: "monospace" }}>{loan.id.slice(-8)}</td>
                      <td>{formatCurrency(loan.montoPrincipal)}</td>
                      <td>{loan.numeroCuotas}</td>
                      <td>{formatCurrency(loan.montoCuota)}</td>
                      <td>
                        <span
                          style={{
                            color: getLoanStatusColor(loan.estado),
                            fontWeight: "600",
                            fontSize: "var(--font-size-xs)",
                            textTransform: "uppercase",
                          }}
                        >
                          {loan.estado}
                        </span>
                      </td>
                      <td>
                        {loan.cuotasPagadas} / {loan.numeroCuotas}
                      </td>
                      <td>{formatCurrency(getRemainingBalance(loan))}</td>
                      <td>
                        <span
                          style={{
                            color:
                              loan.scoreAprobacion >= 70
                                ? "var(--success-500)"
                                : loan.scoreAprobacion >= 50
                                ? "var(--warning-500)"
                                : "var(--error-500)",
                            fontWeight: "600",
                          }}
                        >
                          {loan.scoreAprobacion}%
                        </span>
                      </td>
                      <td>
                        {loan.estado.toLowerCase() === "activo" && loan.cuotasPagadas < loan.numeroCuotas && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              setSelectedLoanId(loan.id);
                              setPaymentForm({ numeroCuotas: 1 });
                              setShowPaymentModal(true);
                            }}
                          >
                            Pagar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Calculate Loan Modal */}
      {showCalculateModal && (
        <div className="modal-overlay" onClick={() => setShowCalculateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Card>
              <CardHeader title="Calcular Préstamo" subtitle="Simula tu préstamo antes de solicitarlo" />
              <CardBody>
                <form onSubmit={handleCalculateLoan}>
                  <div className="form-group">
                    <label htmlFor="monto">Monto del Préstamo (COL$)</label>
                    <input
                      type="number"
                      id="monto"
                      value={calculateForm.monto}
                      onChange={(e) =>
                        setCalculateForm((prev) => ({
                          ...prev,
                          monto: Number(e.target.value),
                        }))
                      }
                      required
                      min="100"
                      max="50000"
                      step="50"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cuotas">Número de Cuotas</label>
                    <select
                      id="cuotas"
                      value={calculateForm.numeroCuotas}
                      onChange={(e) =>
                        setCalculateForm((prev) => ({
                          ...prev,
                          numeroCuotas: Number(e.target.value),
                        }))
                      }
                    >
                      <option value={1}>1 cuota</option>
                      <option value={2}>2 cuotas</option>
                      <option value={3}>3 cuotas</option>
                      <option value={4}>4 cuotas</option>
                      <option value={5}>5 cuotas</option>
                      <option value={6}>6 cuotas</option>
                    </select>
                  </div>

                  {calculation && (
                    <div className="alert alert-info">
                      <div className="alert-title">Resultado de la Simulación</div>
                      <div className="alert-message">
                        <p>
                          <strong>Monto principal:</strong> {formatCurrency(calculation.montoPrincipal)}
                        </p>
                        <p>
                          <strong>Cuota mensual:</strong> {formatCurrency(calculation.montoCuota)}
                        </p>
                        <p>
                          <strong>Total a pagar:</strong> {formatCurrency(calculation.montoTotal)}
                        </p>
                        <p>
                          <strong>Total intereses:</strong> {formatCurrency(calculation.interesTotal)}
                        </p>
                        <p>
                          <strong>Tasa de interés:</strong> {calculation.tasaInteres}
                        </p>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "var(--spacing-3)", marginTop: "var(--spacing-4)" }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <span className="loading">Calculando...</span> : "Calcular"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCalculateModal(false)}>
                      Cerrar
                    </button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Request Loan Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Card>
              <CardHeader title="Solicitar Préstamo" subtitle="Completa los datos para tu solicitud" />
              <CardBody>
                <form onSubmit={handleRequestLoan}>
                  <div className="form-group">
                    <label htmlFor="request-monto">Monto del Préstamo (COL$)</label>
                    <input
                      type="number"
                      id="request-monto"
                      value={requestForm.monto}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          monto: Number(e.target.value),
                        }))
                      }
                      required
                      min="100"
                      max="50000"
                      step="50"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="request-cuotas">Número de Cuotas</label>
                    <select
                      id="request-cuotas"
                      value={requestForm.numeroCuotas}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          numeroCuotas: Number(e.target.value),
                        }))
                      }
                    >
                      <option value={3}>3 cuotas</option>
                      <option value={6}>6 cuotas</option>
                      <option value={9}>9 cuotas</option>
                      <option value={12}>12 cuotas</option>
                      <option value={18}>18 cuotas</option>
                      <option value={24}>24 cuotas</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción del Préstamo</label>
                    <textarea
                      id="descripcion"
                      value={requestForm.descripcion}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          descripcion: e.target.value,
                        }))
                      }
                      placeholder="Describe brevemente para qué necesitas el préstamo..."
                    />
                  </div>

                  <div style={{ display: "flex", gap: "var(--spacing-3)", marginTop: "var(--spacing-4)" }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <span className="loading">Solicitando...</span> : "Solicitar Préstamo"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedLoanId && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Card>
              <CardHeader title="Pagar Cuotas" subtitle="Selecciona el número de cuotas a pagar" />
              <CardBody>
                <form onSubmit={handlePayInstallment}>
                  <div className="form-group">
                    <label htmlFor="payment-cuotas">Número de Cuotas a Pagar</label>
                    <select
                      id="payment-cuotas"
                      value={paymentForm.numeroCuotas || 1}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          numeroCuotas: Number(e.target.value),
                        }))
                      }
                      required
                    >
                      <option value={1}>1 cuota</option>
                      <option value={2}>2 cuotas</option>
                      <option value={3}>3 cuotas</option>
                      <option value={4}>4 cuotas</option>
                      <option value={5}>5 cuotas</option>
                    </select>
                  </div>

                  {selectedLoanId && paymentForm.numeroCuotas && (
                    <div className="alert alert-info">
                      <div className="alert-title">Resumen del Pago</div>
                      <div className="alert-message">
                        {(() => {
                          const loan = loans.find((l) => l.id === selectedLoanId);
                          if (loan) {
                            const totalAmount = loan.montoCuota * (paymentForm.numeroCuotas || 1);
                            return (
                              <>
                                <p>
                                  <strong>Cuotas a pagar:</strong> {paymentForm.numeroCuotas}
                                </p>
                                <p>
                                  <strong>Monto por cuota:</strong> {formatCurrency(loan.montoCuota)}
                                </p>
                                <p>
                                  <strong>Total a pagar:</strong> {formatCurrency(totalAmount)}
                                </p>
                              </>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "var(--spacing-3)", marginTop: "var(--spacing-4)" }}>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? <span className="loading">Procesando...</span> : "Confirmar Pago"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowPaymentModal(false);
                        setSelectedLoanId(null);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;
