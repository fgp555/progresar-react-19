import React, { useState } from "react";
import { Button, Select } from "../UI";
import type { CreateAccountDto, AccountType, Currency } from "../../types";
import "./AccountForm.css";

interface AccountFormProps {
  onSubmit: (accountData: CreateAccountDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const accountTypeOptions = [
  { value: "", label: "Seleccione tipo de cuenta" },
  { value: "ahorro", label: "💰 Cuenta de Ahorros" },
  { value: "prestamo", label: "📈 prestamo" },
];

const currencyOptions = [
  { value: "", label: "Seleccione moneda" },
  { value: "USD", label: "💵 COP - Pesos Colombianos" },
];

export const AccountForm: React.FC<AccountFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateAccountDto>({
    tipoCuenta: "" as AccountType,
    moneda: "" as Currency,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.tipoCuenta) {
      newErrors.tipoCuenta = "Debe seleccionar un tipo de cuenta";
    }

    if (!formData.moneda) {
      newErrors.moneda = "Debe seleccionar una moneda";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user selects an option
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="account-form">
      <div className="form-grid">
        <Select
          label="Tipo de Cuenta *"
          name="tipoCuenta"
          value={formData.tipoCuenta}
          onChange={handleChange}
          options={accountTypeOptions}
          error={errors.tipoCuenta}
          disabled={isLoading}
          helperText="Seleccione el tipo de cuenta que desea crear"
        />

        <Select
          label="Moneda *"
          name="moneda"
          value={formData.moneda}
          onChange={handleChange}
          options={currencyOptions}
          error={errors.moneda}
          disabled={isLoading}
          helperText="Moneda en la que operará la cuenta"
        />
      </div>

      <div className="account-info">
        <h3>Información de la Nueva Cuenta</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Saldo inicial:</span>
            <span className="info-value">$0.00</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estado:</span>
            <span className="info-value">Activa</span>
          </div>
          <div className="info-item">
            <span className="info-label">Número de cuenta:</span>
            <span className="info-value">Se generará automáticamente</span>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          Crear Cuenta
        </Button>
      </div>
    </form>
  );
};
