import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/config/axiosInstance";
import Swal from "sweetalert2";
import styles from "./UserEdit.module.css";
import type { User } from "@/types";
import { useDocumentTypes } from "@/hooks/useDocumentTypes";
import { useDocumentValidation } from "@/hooks/useDocumentValidation";
import { useDeleteUser } from "@/hooks/useDeleteUser";

interface UserUpdateData {
  username: string;
  name: string;
  lastName: string;
  email: string;
  whatsapp: string;
  role: string;
  isActive: boolean;
  documentNumber: string;
  documentType: string;
  cupos: number;
}

const UserEditPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { deleteUser } = useDeleteUser();

  const handleDelete = async (id: string) => {
    const input = window.prompt('Para eliminar este usuario escribe la palabra "eliminar":');

    if (input?.toLowerCase() === "eliminar") {
      const result = await deleteUser(id);
      if (result?.success) {
        alert(result.message);
        navigate("/users"); // 👈 redirección después de eliminar
      }
    } else if (input !== null) {
      alert("Debes escribir exactamente 'eliminar' para confirmar.");
    }
  };

  // Custom hooks
  const {
    // documentTypes,
    loading: typesLoading,
    error: typesError,
    getDocumentTypeOptions,
    findDocumentTypeByCode,
    clearError: clearTypesError,
  } = useDocumentTypes();

  const { validateDocumentNumber } = useDocumentValidation();

  // Local state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Form data
  const [formData, setFormData] = useState<UserUpdateData>({
    username: "",
    name: "",
    lastName: "",
    email: "",
    whatsapp: "",
    role: "user",
    isActive: true,
    documentNumber: "",
    documentType: "",
    cupos: 1,
  });

  // Get document type options for select
  const documentTypeOptions = getDocumentTypeOptions();

  // Fetch user data
  useEffect(() => {
    if (!userId) {
      setError("ID de usuario no proporcionado");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res: any = await axiosInstance.get(`/api/progresar/usuarios/${userId}`);
        const userData = res.data.data;
        setUser(userData);

        // Populate form with user data
        setFormData({
          username: userData.username || "",
          name: userData.name || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          whatsapp: userData.whatsapp || "",
          role: userData.role || "user",
          isActive: userData.isActive ?? true,
          documentNumber: userData.documentNumber || "",
          documentType: userData.documentType?.code || "",
          cupos: userData.cupos || 1,
        });

        setError("");
      } catch (err: unknown) {
        let errorMessage = "Error al cargar usuario";

        if (err && typeof err === "object") {
          if ("response" in err && err.response && typeof err.response === "object" && "data" in err.response) {
            const responseData = err.response.data as any;
            errorMessage = responseData?.message || errorMessage;
          } else if ("message" in err && typeof err.message === "string") {
            errorMessage = err.message;
          }
        }

        console.error("Error al cargar usuario:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Handle input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      const numValue = parseInt(value) || 1;
      setFormData((prev) => ({
        ...prev,
        [name]: Math.max(1, numValue), // Mínimo 1 cupo
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Real-time validation for document number
      if (name === "documentNumber" && formData.documentType && value) {
        const validation = validateDocumentNumber(formData.documentType, value);
        if (!validation.isValid) {
          setValidationErrors((prev) => ({
            ...prev,
            documentNumber: validation.message || "Número de documento inválido",
          }));
        }
      }
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Required fields validation
    if (!formData.name.trim()) errors.name = "El nombre es requerido";
    if (!formData.lastName.trim()) errors.lastName = "El apellido es requerido";
    if (!formData.email.trim()) errors.email = "El email es requerido";
    if (!formData.username.trim()) errors.username = "El nombre de usuario es requerido";
    if (!formData.documentNumber.trim()) errors.documentNumber = "El número de documento es requerido";
    if (!formData.documentType) errors.documentType = "El tipo de documento es requerido";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Por favor ingresa un email válido";
    }

    // Document validation
    if (formData.documentType && formData.documentNumber) {
      const validation = validateDocumentNumber(formData.documentType, formData.documentNumber);
      if (!validation.isValid) {
        errors.documentNumber = validation.message || "Número de documento inválido";
      }
    }

    // Check if document type exists
    if (formData.documentType && !findDocumentTypeByCode(formData.documentType)) {
      errors.documentType = "Tipo de documento no válido";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

    // Validate form
    if (!validateForm()) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res: any = await axiosInstance.patch(`/api/progresar/usuarios/${userId}`, formData);

      if (res.data.success) {
        setSuccess("Usuario actualizado correctamente");

        // Show success message
        await Swal.fire({
          title: "¡Éxito!",
          text: "El usuario ha sido actualizado correctamente",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#dc2626",
        });

        // Navigate back to user details
        navigate(`/userDetails/${userId}`);
      }
    } catch (err: unknown) {
      let errorMessage = "Error al actualizar usuario";

      if (err && typeof err === "object") {
        if ("response" in err && err.response && typeof err.response === "object" && "data" in err.response) {
          const responseData = err.response.data as any;
          errorMessage = responseData?.message || errorMessage;
        } else if ("message" in err && typeof err.message === "string") {
          errorMessage = err.message;
        }
      }

      console.error("Error al actualizar usuario:", err);
      setError(errorMessage);

      // Show error message
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel/reset
  const handleCancel = () => {
    if (!user) return;

    // Reset form to original values
    setFormData({
      username: user.username || "",
      name: user.name || "",
      lastName: user.lastName || "",
      email: user.email || "",
      whatsapp: user.whatsapp || "",
      role: user.role || "user",
      isActive: user.isActive ?? true,
      documentNumber: user.documentNumber || "",
      documentType: user.documentType?.code || "",
      cupos: user.cupos || 1,
    });

    setError("");
    setSuccess("");
    setValidationErrors({});
  };

  // Get document type info for display
  const currentDocumentType = formData.documentType ? findDocumentTypeByCode(formData.documentType) : null;

  // Loading state
  if (loading || typesLoading) {
    return (
      <div className={styles.loading}>
        <p>Cargando información del usuario...</p>
        {typesLoading && <p>Cargando tipos de documento...</p>}
      </div>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <Link to="/dashboard/users" className={`${styles.btn} ${styles.btnSecondary}`} style={{ marginTop: "1rem" }}>
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.error}>
        <p>No se encontró el usuario</p>
        <Link to="/dashboard/users" className={`${styles.btn} ${styles.btnSecondary}`} style={{ marginTop: "1rem" }}>
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.userEdit}>
      <div className={styles.header}>
        <Link to={`/userDetails/${userId}`} className={styles.backBtn}>
          <i className="fa-solid fa-arrow-left"></i>
          Volver
        </Link>
        <h2>Editar Usuario</h2>
        <button className={styles.deleteBtn} onClick={() => handleDelete(userId!)}>
          <i className="fas fa-trash"></i>
          Eliminar Usuario
        </button>
      </div>

      {/* Error messages */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {typesError && (
        <div className={styles.errorMessage}>
          Error al cargar tipos de documento: {typesError}
          <button onClick={clearTypesError} style={{ marginLeft: "10px" }}>
            ×
          </button>
        </div>
      )}
      {success && <div className={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Información Personal */}
          <div className={`${styles.sectionHeader} ${styles.formFull}`}>
            <h3>Información Personal</h3>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre"
              className={validationErrors.name ? styles.inputError : ""}
              required
            />
            {validationErrors.name && <small className={styles.errorText}>{validationErrors.name}</small>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Apellido *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Ingresa el apellido"
              className={validationErrors.lastName ? styles.inputError : ""}
              required
            />
            {validationErrors.lastName && <small className={styles.errorText}>{validationErrors.lastName}</small>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="usuario@ejemplo.com"
              className={validationErrors.email ? styles.inputError : ""}
              required
            />
            {validationErrors.email && <small className={styles.errorText}>{validationErrors.email}</small>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="+57-301-000000"
            />
          </div>

          {/* Documentación */}
          <div className={`${styles.sectionHeader} ${styles.formFull}`}>
            <h3>Documentación</h3>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="documentType">Tipo de Documento *</label>
            <select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleInputChange}
              className={validationErrors.documentType ? styles.inputError : ""}
              required
            >
              <option value="">Seleccionar tipo de documento</option>
              {documentTypeOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {validationErrors.documentType && (
              <small className={styles.errorText}>{validationErrors.documentType}</small>
            )}
            {currentDocumentType && (
              <small className={styles.helpText}>Tipo seleccionado: {currentDocumentType.name}</small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="documentNumber">Número de Documento *</label>
            <input
              type="text"
              id="documentNumber"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleInputChange}
              placeholder="Número de documento"
              className={validationErrors.documentNumber ? styles.inputError : ""}
              required
            />
            {validationErrors.documentNumber && (
              <small className={styles.errorText}>{validationErrors.documentNumber}</small>
            )}
          </div>

          {/* Configuración de Cuenta */}
          <div className={`${styles.sectionHeader} ${styles.formFull}`}>
            <h3>Configuración de Cuenta</h3>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">Nombre de Usuario *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="nombreusuario"
              className={validationErrors.username ? styles.inputError : ""}
              required
            />
            {validationErrors.username && <small className={styles.errorText}>{validationErrors.username}</small>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Rol</label>
            <select id="role" name="role" value={formData.role} onChange={handleInputChange}>
              <option value="user">👤 Usuario</option>
              <option value="admin">👑 Administrador</option>
              <option value="moderator">🛡️ Moderador</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cupos">Cupos Disponibles *</label>
            <input
              type="number"
              id="cupos"
              name="cupos"
              value={formData.cupos}
              onChange={handleInputChange}
              min="1"
              max="10"
              placeholder="1"
              required
            />
            <small className={styles.helpText}>
              Cantidad de cupos que puede utilizar el usuario (mínimo 1, máximo 10)
            </small>
          </div>

          <div className={`${styles.formGroup} ${styles.formFull}`}>
            <label>Estado de la Cuenta</label>
            <div className={styles.toggle}>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span className={styles.toggleLabel}>
                {formData.isActive ? "✅ Cuenta Activa" : "❌ Cuenta Inactiva"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleCancel}
            disabled={saving}
          >
            <i className="fa-solid fa-rotate-left"></i>
            Restablecer
          </button>

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
            <i className="fa-solid fa-save"></i>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>

      {/* User metadata info */}
      <div className={styles.metadata}>
        <div className={styles.metadataItem}>
          <strong>ID:</strong>
          <span className={styles.userId}>{user._id}</span>
        </div>
        <div className={styles.metadataItem}>
          <strong>Tipo de Documento:</strong>
          <span>
            {user.documentType?.name || "No especificado"} ({user.documentType?.code || "N/A"})
          </span>
        </div>
        <div className={styles.metadataItem}>
          <strong>Número de Documento:</strong>
          <span>{user.documentNumber || "No especificado"}</span>
        </div>
        <div className={styles.metadataItem}>
          <strong>Cupos Asignados:</strong>
          <span>{user.cupos}</span>
        </div>
        <div className={styles.metadataItem}>
          <strong>Fecha de Creación:</strong>
          <span>{new Date(user.createdAt).toLocaleString("es-ES")}</span>
        </div>
        <div className={styles.metadataItem}>
          <strong>Última Actualización:</strong>
          <span>{new Date(user.updatedAt).toLocaleString("es-ES")}</span>
        </div>
      </div>
      {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
    </div>
  );
};

export default UserEditPage;
