// src/components/TransactionModal.tsx
import React, { useState } from "react";
import "./TransactionModal.css";

interface TransactionModalProps {
  type: "deposit" | "withdraw" | "transfer";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
}

const labels = {
  deposit: { title: "Depósito", icon: "💰" },
  withdraw: { title: "Retiro", icon: "💸" },
  transfer: { title: "Transferencia", icon: "🔄" },
};

export const TransactionModal: React.FC<TransactionModalProps> = ({ type, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>({
    monto: "",
    descripcion: "",
    cuentaDestinoNumero: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ monto: "", descripcion: "", cuentaDestinoNumero: "" });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-icon">{labels[type].icon}</span>
          <h2>{labels[type].title}</h2>
          <button onClick={onClose} className="modal-close">
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <input
            type="number"
            name="monto"
            placeholder="Monto"
            value={formData.monto}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />

          {type === "transfer" && (
            <input
              type="text"
              name="cuentaDestinoNumero"
              placeholder="Cuenta destino"
              value={formData.cuentaDestinoNumero}
              onChange={handleChange}
              required
            />
          )}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Confirmar
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
