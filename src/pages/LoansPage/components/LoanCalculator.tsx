// components/LoanCalculator.tsx

import React from "react";
import type { CreateLoanForm, LoanCalculation } from "../types/loans";
import { formatCurrency, formatNumberInput, generateCuotasOptions } from "../utils/loanUtils";
import styles from "../LoansPage.module.css";

interface LoanCalculatorProps {
  form: CreateLoanForm;
  calculation: LoanCalculation | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCalculate: () => void;
  onClearValidationError: (fieldName: string) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  form,
  calculation,
  onFormChange,
  onCalculate,
  onClearValidationError,
}) => {
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    onClearValidationError(name);

    if (name === "monto") {
      const { value } = e.target;
      const formattedValue = formatNumberInput(value);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
        },
      };
      onFormChange(syntheticEvent as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
    } else {
      onFormChange(e);
    }
  };

  return (
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
              value={form.monto}
              onChange={handleFormChange}
              placeholder="Ej: 1,000,000"
              className={styles.input}
            />
            <small className={styles.inputHint}>Use format: 1,000,000</small>
          </div>

          <div className={styles.formGroup}>
            <label>Número de cuotas</label>
            <select name="numeroCuotas" value={form.numeroCuotas} onChange={handleFormChange} className={styles.select}>
              {generateCuotasOptions(12).map((num) => (
                <option key={num} value={num}>
                  {num} cuota{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={onCalculate} className={styles.calculateButton}>
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
  );
};
