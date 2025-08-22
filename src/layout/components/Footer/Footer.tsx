import { NavLink } from "react-router-dom"; // Use react-router-dom for NavLink
import "./Footer.css";
import WhatsAppButton from "../WhatsAppButton/WhatsAppButton";
import { siteInfo } from "@/config/siteInfo";

const Footer = () => {
  return (
    <footer className="main-footer">
      <WhatsAppButton />
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section footer-about">
          <h3 className="footer-heading">FGP Team Developers</h3>
          <p className="footer-description">
            Creamos soluciones digitales innovadoras y a medida para impulsar tu negocio. ¡Transformamos ideas en
            realidad!
          </p>
          <div className="footer-social">
            <a href={siteInfo.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href={siteInfo.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href={siteInfo.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fa-brands fa-instagram"></i>
            </a>
            {/* Add more social links as needed */}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section footer-links-section">
          <h3 className="footer-heading">Enlaces</h3>
          <ul className="footer-links-list">
            <li>
              <NavLink to="/">Inicio</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contacto</NavLink>
            </li>
            <li>
              <NavLink to="/auth/login">Iniciar Sesión</NavLink>
            </li>
            <li>
              <NavLink to="/me/support">Soporte</NavLink>
            </li>
            <li>
              <NavLink to="/wardrobe">Wardrobe</NavLink>
            </li>
          </ul>
        </div>

        {/* Legal & Help Section */}
        <div className="footer-section footer-legal-help">
          <h3 className="footer-heading">Legal y Ayuda</h3>
          <ul className="footer-links-list">
            <li>
              <NavLink to="/terms">Términos de Servicio</NavLink>
            </li>
            <li>
              <NavLink to="/privacy">Política de Privacidad</NavLink>
            </li>
            {/* <li>
              <NavLink to="/faq">Preguntas Frecuentes</NavLink>
            </li> */}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section footer-contact">
          <h3 className="footer-heading">Contáctanos</h3>
          <p>
            <i className="fa-solid fa-envelope"></i> {siteInfo.email}
          </p>
          <p>
            <i className="fa-solid fa-phone"></i> {siteInfo.whatsappNumberPlus}
          </p>{" "}
          {/* Example number */}
          <p>
            <i className="fa-solid fa-location-dot"></i> {siteInfo.location}
          </p>{" "}
          {/* Current location */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} FGP Team Developers. Todos los derechos reservados.
        </p>
        <div className="footer-credits">
          <span>Desarrollado por </span>
          <a href="/me/portfolio" target="_blank" rel="noopener noreferrer">
            <span className="footer-credit-name">Frank GP</span>
          </a>
          <span> & </span>
          <a href="https://fgp.one/ivana" target="_blank" rel="noopener noreferrer">
            <span className="footer-credit-name">Ivana Barreto</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
