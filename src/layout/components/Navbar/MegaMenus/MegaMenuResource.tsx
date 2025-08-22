import { NavLink } from "react-router-dom";

const MegaMenuResource = () => {
  return (
    <div className="megaMenu">
      <div className="megaMenuContent">
        <NavLink to="/academy/aws" className="closeMegaMenu">
          <h3 className="menuTitle">RECURSOS</h3>
        </NavLink>
        <div className="megaMenuColumns">
          <div className="menuItem">
            <NavLink to="/resources/help-center" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon info"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Centro de ayuda</h4>
                <p>Encuentra respuestas rápidas sobre el uso de nuestra plataforma</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/resources/contact" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon message-square-mro"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Contáctanos</h4>
                <p>¿Necesitas ayuda con tu proyecto? Estamos para apoyarte</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/resources/blog" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon edit-3-mto"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Blog</h4>
                <p>Tendencias en desarrollo web, móvil y casos de éxito</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/resources/vulnerability-rewards" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon shield"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Programa de vulnerabilidades</h4>
                <p>Ayúdanos a mejorar reportando fallos o vulnerabilidades</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/resources/reliability" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon globe-01-mro"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Confiabilidad</h4>
                <p>Comprometidos con soluciones estables y de alto rendimiento</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/resources/developers" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon code"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Desarrolladores</h4>
                <p>Accede a herramientas, APIs y guías para integraciones</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuResource;
