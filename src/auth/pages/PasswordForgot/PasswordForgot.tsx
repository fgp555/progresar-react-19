import "./PasswordForgot.css";
import { authPasswordService } from "../../service/apiAuthPassword";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { useTheme } from "@/layout/hooks/useTheme";

const PasswordForgot = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [baseURL, _] = useState(window.location.origin);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authPasswordService.forgotPassword(email, baseURL);
      console.log(response);
      Swal.fire(
        "¡Éxito!",
        "Te hemos enviado un correo electrónico para restablecer tu contraseña. Revisa tu bandeja de entrada.",
        "success"
      );
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        setError(message || "Hubo un problema al enviar el email");
        Swal.fire("Error!", message || "Hubo un problema al enviar el email", "error");
      } else {
        setError(error.message || "Error desconocido");
        Swal.fire("Error!", error.message || "Hubo un problema al enviar el email", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const { theme } = useTheme();

  return (
    <div className="ForgotPassword">
      {/* Floating Orbs */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

      <aside className="left">
        <img className="logo" src={`/logo${theme === "dark-mode" ? "-dark" : ""}.svg`} alt="" />

        {/* Email Icon */}
        <div className="email-icon">📧</div>

        <h2>RECUPERAR CONTRASEÑA</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <div>
              <input type="email" value={email} onChange={handleEmailChange} required placeholder="user@mail.com" />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <br />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Enviando..." : "Enviar email"}
          </button>
        </form>
        <br />
        <br />
        <NavLink to="/" className="forgot-password">
          INICIAR SESION
        </NavLink>
        <br />
      </aside>
    </div>
  );
};

export default PasswordForgot;
