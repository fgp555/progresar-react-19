// src\pages\LoansPage\components\LoansList.tsx

import React from "react";
import type { Loan, LoanInstallment } from "../types/loans";
import { formatCurrency, getStatusColor, getProgressPercentage, formatDateLoans } from "../utils/loanUtils";
import styles from "../LoansPage.module.css";

interface LoansListProps {
  loans: Loan[];
  onPayMultiple: (loan: Loan) => void;
  onPaySingle: (loan: Loan, installment: LoanInstallment) => void;
  onRequestLoan: () => void;
}

export const LoansList: React.FC<LoansListProps> = ({ loans, onPayMultiple, onPaySingle, onRequestLoan }) => {
  if (loans.length === 0) {
    return (
      <div className={styles.noLoans}>
        <i className="fas fa-hand-holding-usd"></i>
        <p>No tienes préstamos registrados</p>
        <button onClick={onRequestLoan} className={styles.requestLoanBtn}>
          Solicitar mi primer préstamo
        </button>
      </div>
    );
  }

  return (
    <div className={styles.loansList}>
      {/* <pre>{JSON.stringify(loans, null, 2)}</pre> */}
      {loans.map((loan) => (
        <div key={loan.id} className={styles.loanCard}>
          <div className={styles.loanHeader}>
            <div className={styles.loanInfo}>
              <h3 className={styles.loanTitle}>{formatCurrency(loan.montoPrincipal)}</h3>
              <span className={`${styles.loanStatus} ${styles[getStatusColor(loan.estado)]}`}>{loan.estado}</span>
            </div>
            <div className={styles.loanProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${getProgressPercentage(loan)}%` }}></div>
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
              {/* <pre>{JSON.stringify(loan.fechaVencimiento, null, 2)}</pre> */}
              <span>{formatDateLoans(loan.fechaVencimiento)}</span>
            </div>
          </div>

          {loan.estado === "activo" && (
            <div className={styles.loanActions}>
              <button onClick={() => onPayMultiple(loan)} className={styles.payButton}>
                <i className="fas fa-credit-card"></i>
                Pagar Múltiples Cuotas
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
                      Vence: {formatDateLoans(installment.fechaVencimiento)}
                    </span>
                    <span className={`${styles.installmentStatus} ${styles[getStatusColor(installment.estado)]}`}>
                      {installment.estado}
                      {installment.fechaPago && (
                        <span className={styles.payDate}> (Pagada: {formatDateLoans(installment.fechaPago)})</span>
                      )}
                    </span>
                  </div>
                  {installment.estado === "pendiente" && loan.estado === "activo" && (
                    <div className={styles.installmentActions}>
                      <button onClick={() => onPaySingle(loan, installment)} className={styles.paySingleButton}>
                        <i className="fas fa-money-bill-wave"></i>
                        Pagar Esta Cuota
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
