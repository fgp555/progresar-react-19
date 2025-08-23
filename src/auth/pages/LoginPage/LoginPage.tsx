import "./LoginPage.css";
import { adminEmail, adminPassword } from "@/config/constants";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { useTheme } from "@/layout/hooks/useTheme";
import Swal from "sweetalert2";

const LoginPage = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState(adminPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectURL = searchParams.get("redirectURL") || "/dashboard";

  const { isAdmin, isAuthenticated, handleLogin, userState } = useAuth();

  useEffect(() => {
    console.log("userState?._id", userState?._id);
    if (isAuthenticated) {
      if (isAdmin) {
        navigate(redirectURL);
      } else {
        navigate(`/userDetails/${userState?._id}`);
      }
    }
  }, [isAuthenticated, navigate, redirectURL]);

  const handleEmailChange = (e: any) => setEmail(e.target.value.trim());
  const handlePasswordChange = (e: any) => setPassword(e.target.value.trim());
  const toggleShowPassword = () => setShowPassword((prevState) => !prevState);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    setLoading(true);

    try {
      await handleLogin(trimmedEmail, trimmedPassword, "/api/auth/loginNoCaptcha");
    } catch (error) {
      setError("Correo electrónico o contraseña inválidos");
      Swal.fire("¡Error!", "Correo electrónico o contraseña inválidos", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginPage">
      {/* Floating Orbs */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

      <aside className="left">
        <img className="logo" src={`/logo${theme === "dark-mode" ? "-dark" : ""}.svg`} alt="" />
        <div className="header">
          <h1>🏦 PROGRESAR</h1>
          <p>PROYECCION FONDO DE AHORRO</p>
        </div>
        <br />
        <h2>INICIO DE SESIÓN</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="user@mail.com"
                className="input-custom"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder="************"
                className="input-custom"
              />
              <button type="button" className="toggle-password " onClick={toggleShowPassword}>
                {showPassword ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
              </button>
            </div>
          </div>
          <div className="forgot-password">
            <NavLink to="/password/forgot" className={"forgot-password"}>
              RECUPERAR CONTRASEÑA
            </NavLink>
          </div>
          {error && <div className="error-message">{error}</div>}
          <br />

          <br />
          <button type="submit" disabled={loading} className="btn btn-primary login-btn">
            <i className="fa-solid fa-right-to-bracket"></i>
            {loading ? "Iniciando..." : "INGRESAR"}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default LoginPage;
