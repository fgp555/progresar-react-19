import { baseUrl } from "@/config/constants";
import { siteInfo } from "@/config/siteInfo";

interface GoogleLoginButtonProps {
  textButton?: string;
  className?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ textButton = "Acceder", className = "buttonLogin" }) => {
  const handleGoogleLogin = () => {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = `${baseUrl}/api/oauth/login`;
  };

  return (
    <button onClick={handleGoogleLogin} className={className}>
      <img src={siteInfo.logoGoogleSVG} alt="" />
      <span>{textButton}</span>
    </button>
  );
};

export default GoogleLoginButton;
