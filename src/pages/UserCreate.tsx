import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/config/axiosInstance";
import styles from "./UserCreate.module.css";

interface CreateUserData {
  name: string;
  lastName: string;
  email: string;
  whatsapp: string;
  password: string;
  role: string;
  documentNumber: string;
  cupos: number;
  documentType: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const UserCreate: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    lastName: "",
    email: "",
    whatsapp: "",
    password: "",
    role: "user",
    documentNumber: "",
    cupos: 1,
    documentType: "CC",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const documentTypes = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "RC", label: "Registro Civil" },
  ];

  const roles = [
    { value: "user", label: "Usuario", icon: "👤" },
    { value: "admin", label: "Administrador", icon: "👑" },
    // { value: "moderator", label: "Moderador", icon: "🛡️" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (type === "number") {
      const numValue = parseInt(value) || 1;
      setFormData((prev) => ({
        ...prev,
        [name]: Math.max(1, Math.min(10, numValue)), // Between 1 and 10
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Required fields validation
    if (!formData.name.trim()) errors.name = "El nombre es requerido";
    if (!formData.lastName.trim()) errors.lastName = "El apellido es requerido";
    if (!formData.email.trim()) errors.email = "El email es requerido";
    if (!formData.password.trim()) errors.password = "La contraseña es requerida";
    if (!formData.documentNumber.trim()) errors.documentNumber = "El número de documento es requerido";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Por favor ingresa un email válido";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Solo números, de 7 a 15 dígitos
    if (formData.whatsapp && !/^\d{7,15}$/.test(formData.whatsapp)) {
      errors.whatsapp = "Solo números, entre 7 y 15 dígitos";
    }

    // Document number validation
    if (formData.documentNumber && formData.documentNumber.length < 6) {
      errors.documentNumber = "El número de documento debe tener al menos 6 caracteres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response: any = await axiosInstance.post("/api/progresar/usuarios", formData);

      if (response.data.success) {
        // Navigate to users list or user details
        navigate("/users");
      } else {
        setError("Error al crear el usuario");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al crear el usuario";
      setError(errorMessage);
      console.error("Error creating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      lastName: "",
      email: "",
      whatsapp: "",
      password: "",
      role: "user",
      documentNumber: "",
      cupos: 1,
      documentType: "CC",
    });
    setValidationErrors({});
    setError("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear Nuevo Usuario</h1>
        <Link to="/users" className={styles.backBtn}>
          <i className="fas fa-arrow-left"></i>
          Volver a Usuarios
        </Link>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Personal Information Section */}
          <div className={styles.sectionHeader}>
            <h3>Información Personal</h3>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre"
              className={`${styles.input} ${validationErrors.name ? styles.inputError : ""}`}
              required
            />
            {validationErrors.name && <span className={styles.errorText}>{validationErrors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Apellido *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Ingresa el apellido"
              className={`${styles.input} ${validationErrors.lastName ? styles.inputError : ""}`}
              required
            />
            {validationErrors.lastName && <span className={styles.errorText}>{validationErrors.lastName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="usuario@ejemplo.com"
              className={`${styles.input} ${validationErrors.email ? styles.inputError : ""}`}
              required
            />
            {validationErrors.email && <span className={styles.errorText}>{validationErrors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="whatsapp" className={styles.label}>
              WhatsApp
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="+57-300-1234567"
              className={`${styles.input} ${validationErrors.whatsapp ? styles.inputError : ""}`}
            />
            {validationErrors.whatsapp && <span className={styles.errorText}>{validationErrors.whatsapp}</span>}
            <small className={styles.helpText}>Formato: +57-300-1234567 (opcional)</small>
          </div>

          {/* Document Information Section */}
          <div className={styles.sectionHeader}>
            <h3>Documentación</h3>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="documentType" className={styles.label}>
              Tipo de Documento *
            </label>
            <select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.value} - {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="documentNumber" className={styles.label}>
              Número de Documento *
            </label>
            <input
              type="text"
              id="documentNumber"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleInputChange}
              placeholder="Número de documento"
              className={`${styles.input} ${validationErrors.documentNumber ? styles.inputError : ""}`}
              required
            />
            {validationErrors.documentNumber && (
              <span className={styles.errorText}>{validationErrors.documentNumber}</span>
            )}
          </div>

          {/* Account Configuration Section */}
          <div className={styles.sectionHeader}>
            <h3>Configuración de Cuenta</h3>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Contraseña (mínimo 6 caracteres)"
              className={`${styles.input} ${validationErrors.password ? styles.inputError : ""}`}
              required
            />
            {validationErrors.password && <span className={styles.errorText}>{validationErrors.password}</span>}
            <small className={styles.helpText}>Mínimo 6 caracteres</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>
              Rol del Usuario
            </label>
            <select id="role" name="role" value={formData.role} onChange={handleInputChange} className={styles.select}>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.icon} {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cupos" className={styles.label}>
              Cupos Disponibles *
            </label>
            <input
              type="number"
              id="cupos"
              name="cupos"
              value={formData.cupos}
              onChange={handleInputChange}
              min="1"
              max="10"
              className={styles.input}
              required
            />
            <small className={styles.helpText}>Cantidad de cupos que puede utilizar el usuario (1-10)</small>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleReset}
            className={`${styles.btn} ${styles.btnSecondary}`}
            disabled={loading}
          >
            <i className="fas fa-undo"></i>
            Limpiar Formulario
          </button>

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
            <i className="fas fa-user-plus"></i>
            {loading ? "Creando Usuario..." : "Crear Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreate;
