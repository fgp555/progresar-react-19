// components/LoanRequestForm.tsx

import React from "react";
import type { CreateLoanForm } from "../types/loans";
import type { ValidationErrors } from "../utils/loanValidation";
import { formatNumberInput, generateCuotasOptions } from "../utils/loanUtils";
import styles from "../LoansPage.module.css";

interface LoanRequestFormProps {
  form: CreateLoanForm;
  validationErrors: ValidationErrors;
  submitting: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  onClearValidationError: (fieldName: string) => void;
}

export const LoanRequestForm: React.FC<LoanRequestFormProps> = ({
  form,
  validationErrors,
  submitting,
  onFormChange,
  onSubmit,
  onClearValidationError,
}) => {
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    onClearValidationError(name);

    if (type === "number") {
      // Permitir vacío o número válido
      const numValue = value === "" ? "" : parseInt(value) || 0;
      onFormChange({
        ...e,
        target: { ...e.target, value: numValue.toString() },
      } as any);
    } else {
      onFormChange(e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={styles.requestTab}>
      <h3>Asignar Préstamo</h3>
      <p>Complete los datos para solicitar su préstamo</p>

      <form onSubmit={handleSubmit} className={styles.loanForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroupContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="monto">Monto solicitado *</label>
              <input
                type="text"
                id="monto"
                name="monto"
                value={form.monto}
                onChange={onFormChange}
                onBlur={(e) => {
                  const formatted = formatNumberInput(e.target.value);
                  onFormChange({
                    ...e,
                    target: { ...e.target, value: formatted },
                  } as any);
                }}
                placeholder="Ej: 1,000,000"
                className={`${styles.input} ${validationErrors.monto ? styles.inputError : ""}`}
                required
              />

              <small className={styles.inputHint}>Use format: 1,000,000</small>
              {validationErrors.monto && <span className={styles.errorText}>{validationErrors.monto}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="numeroCuotas">Número de cuotas *</label>
              <select
                id="numeroCuotas"
                name="numeroCuotas"
                value={form.numeroCuotas}
                onChange={onFormChange}
                className={`${styles.input} ${validationErrors.numeroCuotas ? styles.inputError : ""}`}
                required
              >
                <option value="">Seleccione...</option>
                {generateCuotasOptions(12).map((cuota) => (
                  <option key={cuota} value={cuota}>
                    {cuota} {cuota === 1 ? "cuota" : "cuotas"}
                  </option>
                ))}
              </select>
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
                value={form.fechaCreacion}
                onChange={handleFormChange}
                className={`${styles.input} ${validationErrors.fechaCreacion ? styles.inputError : ""}`}
                required
              />
              {validationErrors.fechaCreacion && (
                <span className={styles.errorText}>{validationErrors.fechaCreacion}</span>
              )}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="descripcion">Descripción del préstamo</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleFormChange}
              placeholder="Describa el motivo del préstamo..."
              className={`${styles.textarea} ${validationErrors.descripcion ? styles.inputError : ""}`}
              rows={3}
            />
            {validationErrors.descripcion && <span className={styles.errorText}>{validationErrors.descripcion}</span>}
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={submitting}>
          <i className="fas fa-paper-plane"></i>
          {submitting ? "Procesando solicitud..." : "Asignar Préstamo"}
        </button>
      </form>
    </div>
  );
};
