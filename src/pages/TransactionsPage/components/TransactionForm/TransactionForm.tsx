// components/TransactionForm/TransactionForm.tsx
import React from "react";
import type { TransactionForm, TransactionType } from "../../types/transaction.types";
import styles from "./TransactionForm.module.css";

interface TransactionFormProps {
  type: TransactionType;
  form: TransactionForm;
  submitting: boolean;
  validationErrors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: TransactionType) => void;
  onSubmit: (type: TransactionType) => void;
}

export const TransactionFormComponent: React.FC<TransactionFormProps> = ({
  type,
  form,
  submitting,
  validationErrors,
  onChange,
  onSubmit,
}) => {
  const title = type === "deposit" ? "Realizar Depósito" : "Realizar Retiro";
  const buttonText = type === "deposit" ? "Realizar Depósito" : "Realizar Retiro";
  const buttonClass = type === "deposit" ? styles.btnDeposit : styles.btnWithdraw;
  const icon = type === "deposit" ? "fas fa-arrow-down" : "fas fa-arrow-up";
  const prefix = type === "deposit" ? "deposit_" : "withdraw_";

  return (
    <div className={styles.transactionForm}>
      <h3>{title}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(type);
        }}
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor={`${type}-monto`}>Monto *</label>
            <input
              type="number"
              id={`${type}-monto`}
              name="monto"
              value={form.monto}
              onChange={(e) => onChange(e, type)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`${styles.input} ${validationErrors[`${prefix}monto`] ? styles.inputError : ""}`}
              required
            />
            {validationErrors[`${prefix}monto`] && (
              <span className={styles.errorText}>{validationErrors[`${prefix}monto`]}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={`${type}-fecha`}>Fecha *</label>
            <input
              type="date"
              id={`${type}-fecha`}
              name="fecha"
              value={form.fecha}
              onChange={(e) => onChange(e, type)}
              className={`${styles.input} ${validationErrors[`${prefix}fecha`] ? styles.inputError : ""}`}
              required
            />
            {validationErrors[`${prefix}fecha`] && (
              <span className={styles.errorText}>{validationErrors[`${prefix}fecha`]}</span>
            )}
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor={`${type}-descripcion`}>Descripción *</label>
            <textarea
              id={`${type}-descripcion`}
              name="descripcion"
              value={form.descripcion}
              onChange={(e) => onChange(e, type)}
              placeholder={`Describe el motivo del ${type === "deposit" ? "depósito" : "retiro"}...`}
              className={`${styles.textarea} ${validationErrors[`${prefix}descripcion`] ? styles.inputError : ""}`}
              rows={3}
            />
            {validationErrors[`${prefix}descripcion`] && (
              <span className={styles.errorText}>{validationErrors[`${prefix}descripcion`]}</span>
            )}
          </div>
        </div>

        <button type="submit" className={`${styles.btn} ${buttonClass}`} disabled={submitting}>
          <i className={icon}></i>
          {submitting ? "Procesando..." : buttonText}
        </button>
      </form>
    </div>
  );
};
