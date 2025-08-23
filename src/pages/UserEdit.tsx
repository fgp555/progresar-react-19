import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/config/axiosInstance";
import Swal from "sweetalert2";
import "./UserEdit.css";

interface User {
  _id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  whatsapp: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserUpdateData {
  username: string;
  name: string;
  lastName: string;
  email: string;
  whatsapp: string;
  role: string;
  isActive: boolean;
}

const UserEditPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Form data
  const [formData, setFormData] = useState<UserUpdateData>({
    username: "",
    name: "",
    lastName: "",
    email: "",
    whatsapp: "",
    role: "user",
    isActive: true,
  });

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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

    // Basic validation
    if (!formData.name || !formData.lastName || !formData.email || !formData.username) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un email válido");
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

        // Navigate back to user details or users list
        navigate(`/dashboard/users/${userId}`);
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
    });

    setError("");
    setSuccess("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="user-edit-loading">
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <div className="user-edit-error">
        <p>{error}</p>
        <Link to="/dashboard/users" className="btn btn-secondary" style={{ marginTop: "1rem" }}>
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-edit-error">
        <p>No se encontró el usuario</p>
        <Link to="/dashboard/users" className="btn btn-secondary" style={{ marginTop: "1rem" }}>
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="user-edit">
      <div className="user-edit-header">
        <h2>Editar Usuario</h2>
        <Link to={`/userDetails/${userId}`} className="user-edit-back-btn">
          <i className="fa-solid fa-arrow-left"></i>
          Volver
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="user-edit-form">
        <div className="user-edit-form-grid">
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Apellido *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Ingresa el apellido"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
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

          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="nombreusuario"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select id="role" name="role" value={formData.role} onChange={handleInputChange}>
              <option value="user">👤 Usuario</option>
              <option value="admin">👑 Administrador</option>
              <option value="moderator">🛡️ Moderador</option>
            </select>
          </div>

          <div className="form-group user-edit-form-full">
            <label>Estado de la Cuenta</label>
            <div className="user-edit-toggle">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span className="user-edit-toggle-label">
                {formData.isActive ? "✅ Cuenta Activa" : "❌ Cuenta Inactiva"}
              </span>
            </div>
          </div>
        </div>

        <div className="user-edit-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
            <i className="fa-solid fa-rotate-left"></i>
            Restablecer
          </button>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            <i className="fa-solid fa-save"></i>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>

      {/* User metadata info */}
      <div className="user-edit-metadata">
        <div className="user-edit-metadata-item">
          <strong>ID:</strong>
          <span className="user-edit-id">{user._id}</span>
        </div>
        <div className="user-edit-metadata-item">
          <strong>Fecha de Creación:</strong>
          <span>{new Date(user.createdAt).toLocaleString("es-ES")}</span>
        </div>
        <div className="user-edit-metadata-item">
          <strong>Última Actualización:</strong>
          <span>{new Date(user.updatedAt).toLocaleString("es-ES")}</span>
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;
