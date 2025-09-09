// components/PaymentModals.tsx

import React from "react";
import type { Loan, LoanInstallment, PayInstallmentForm, PaySingleInstallmentForm } from "../types/loans";
import type { ValidationErrors } from "../utils/loanValidation";
import { formatCurrency, formatDate, getStatusColor } from "../utils/loanUtils";
import styles from "../LoansPage.module.css";

interface PaymentModalsProps {
  // Multiple payment modal
  showPayModal: boolean;
  selectedLoan: Loan | null;
  payForm: PayInstallmentForm;
  // Single payment modal
  showSinglePayModal: boolean;
  selectedInstallment: LoanInstallment | null;
  singlePayForm: PaySingleInstallmentForm;
  // Common
  validationErrors: ValidationErrors;
  submitting: boolean;
  onClosePayModal: () => void;
  onCloseSinglePayModal: () => void;
  onPayFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSinglePayFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPayInstallments: () => void;
  onPaySingleInstallment: () => void;
}

export const PaymentModals: React.FC<PaymentModalsProps> = ({
  showPayModal,
  selectedLoan,
  payForm,
  showSinglePayModal,
  selectedInstallment,
  singlePayForm,
  validationErrors,
  submitting,
  onClosePayModal,
  onCloseSinglePayModal,
  onPayFormChange,
  onSinglePayFormChange,
  onPayInstallments,
  onPaySingleInstallment,
}) => {
  return (
    <>
      {/* Pay Multiple Installments Modal */}
      {showPayModal && selectedLoan && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Pagar Múltiples Cuotas - Préstamo</h3>
              <button onClick={onClosePayModal} className={styles.modalClose}>
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
                    onChange={onPayFormChange}
                    className={`${styles.select} ${validationErrors.numeroCuotas ? styles.inputError : ""}`}
                  >
                    {Array.from(
                      { length: Math.min(12, selectedLoan.numeroCuotas - selectedLoan.cuotasPagadas) },
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
                    onChange={onPayFormChange}
                    className={`${styles.input} ${validationErrors.fechaPago ? styles.inputError : ""}`}
                  />
                  {validationErrors.fechaPago && <span className={styles.errorText}>{validationErrors.fechaPago}</span>}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={onClosePayModal} className={styles.cancelButton} disabled={submitting}>
                Cancelar
              </button>
              <button onClick={onPayInstallments} className={styles.confirmButton} disabled={submitting}>
                <i className="fas fa-credit-card"></i>
                {submitting ? "Procesando..." : "Pagar Cuotas"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Single Installment Modal */}
      {showSinglePayModal && selectedLoan && selectedInstallment && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Pagar Cuota Individual</h3>
              <button onClick={onCloseSinglePayModal} className={styles.modalClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.loanSummary}>
                <p>
                  <strong>Préstamo:</strong> {formatCurrency(selectedLoan.montoPrincipal)}
                </p>
                <p>
                  <strong>Cuota #{selectedInstallment.numeroCuota}:</strong> {formatCurrency(selectedInstallment.monto)}
                </p>
                <p>
                  <strong>Fecha de vencimiento:</strong> {formatDate(selectedInstallment.fechaVencimiento)}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span className={`${styles.status} ${styles[getStatusColor(selectedInstallment.estado)]}`}>
                    {selectedInstallment.estado}
                  </span>
                </p>
              </div>

              <div className={styles.payForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="single-pay-fechaPago">Fecha de pago</label>
                  <input
                    type="date"
                    id="single-pay-fechaPago"
                    name="fechaPago"
                    value={singlePayForm.fechaPago}
                    onChange={onSinglePayFormChange}
                    className={`${styles.input} ${validationErrors.fechaPago ? styles.inputError : ""}`}
                  />
                  {validationErrors.fechaPago && <span className={styles.errorText}>{validationErrors.fechaPago}</span>}
                </div>

                <div className={styles.paymentSummary}>
                  <div className={styles.summaryItem}>
                    <span>Monto a pagar:</span>
                    <strong>{formatCurrency(selectedInstallment.monto)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={onCloseSinglePayModal} className={styles.cancelButton} disabled={submitting}>
                Cancelar
              </button>
              <button onClick={onPaySingleInstallment} className={styles.confirmButton} disabled={submitting}>
                <i className="fas fa-money-bill-wave"></i>
                {submitting ? "Procesando..." : `Pagar ${formatCurrency(selectedInstallment.monto)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
