import React, { useState } from "react";
import { Button, Input } from "../UI";
import type { CreateUserDto, FormErrors } from "../../types";
import "./UserForm.css";

interface UserFormProps {
  onSubmit: (userData: CreateUserDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateUserDto>({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email es inválido";
    }

    if (formData.telefono && !/^\+?[\d\s\-\(\)]+$/.test(formData.telefono)) {
      newErrors.telefono = "El formato del teléfono es inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        telefono: formData.telefono?.trim() || undefined,
      });
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-grid">
        <Input
          label="Nombre completo *"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          placeholder="Ingrese el nombre completo"
          disabled={isLoading}
        />

        <Input
          label="Email *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="usuario@ejemplo.com"
          disabled={isLoading}
        />

        <Input
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          error={errors.telefono}
          placeholder="+51-999-123456"
          disabled={isLoading}
          helperText="Formato: +51-999-123456 (opcional)"
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          Crear Usuario
        </Button>
      </div>
    </form>
  );
};
