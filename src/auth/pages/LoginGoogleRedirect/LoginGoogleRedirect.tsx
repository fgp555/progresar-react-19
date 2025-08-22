// src/pages/GoogleSuccessRedirect.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRedirectToLastURL } from "../../hooks/useRedirectToLastURL";
import { useAuth } from "../../hooks/useAuth";
import { decodeToken } from "../../utils/jwt";

const LoginGoogleRedirect = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser, setRefreshToken } = useAuth();
  const redirectToLastURL = useRedirectToLastURL();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    if (accessToken && refreshToken) {
      try {
        const user = decodeToken(accessToken);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(user);
        redirectToLastURL();
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/auth/login");
      }
    }
  }, []);

  return <p>Redirigiendo...</p>;
};

export default LoginGoogleRedirect;
