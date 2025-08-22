import "./PasswordRestore.css";
import { authPasswordService } from "../../service/apiAuthPassword";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { useTheme } from "@/layout/hooks/useTheme";

const PasswordRestore = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword((prevState) => !prevState);
  const resetToken = searchParams.get("resetToken"); // obtiene el token desde query param

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authPasswordService.restorePassword(resetToken, newPassword);
      console.log(response);
      Swal.fire(
        "¡Éxito!",
        "Tu contraseña ha sido restablecida correctamente. Ahora puedes acceder con tu nueva contraseña.",
        "success"
      );
      navigate("/");
    } catch (error: unknown) {
      let errorMessage = "Hubo un problema al restablecer la contraseña";

      if (error && typeof error === "object") {
        // Error de Axios o similar
        if ("response" in error && error.response && typeof error.response === "object" && "data" in error.response) {
          const responseData = error.response.data as any;
          errorMessage = responseData?.message || errorMessage;
        }
        // Error con mensaje
        else if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      Swal.fire("Error!", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const { theme } = useTheme();

  return (
    <div className="RestorePassword">
      {/* Floating Orbs */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

      <aside className="left">
        <img className="logo" src={`/logo${theme === "dark-mode" ? "-dark" : ""}.svg`} alt="" />

        {/* Security Icon */}
        <div className="security-icon">🔒</div>

        <h2>NUEVO PASSWORD</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nuevo Password:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="************"
              />
              <button type="button" className="toggle-password" onClick={toggleShowPassword}>
                {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <br />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Procesando..." : "RESTABLECER CONTRASEÑA"}
          </button>
        </form>
        <br />
        <br />
        <NavLink to="/" className="forgot-password">
          INICIAR SESIÓN
        </NavLink>
        <br />
      </aside>
    </div>
  );
};

export default PasswordRestore;
