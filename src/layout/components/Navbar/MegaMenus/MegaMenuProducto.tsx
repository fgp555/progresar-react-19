import { NavLink } from "react-router-dom";

const MegaMenuProducto = () => {
  return (
    <div className="megaMenu">
      <div className="megaMenuContent">
        <NavLink to="/product" className="closeMegaMenu">
          <h3 className="menuTitle">PRODUCTOS</h3>
        </NavLink>
        <div className="megaMenuColumns">
          <div className="menuItem">
            <NavLink to="/cloud-storage" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon cloud-mro"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Almacenamiento en la nube</h4>
                <p>Guarda y accede a tus archivos desde cualquier lugar</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/vpn" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon shield"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>VPN</h4>
                <p>Protege tu conexión y navega de forma segura</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/password-manager" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon lock-mto"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Gestor de contraseñas</h4>
                <p>Administra tus claves y accede desde cualquier dispositivo</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/chat-meetings" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon message-circle-mto"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Chat y reuniones</h4>
                <p>Comunicación segura y privada para tu equipo</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/object-storage" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon database-mro"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Object Storage</h4>
                <p>Almacenamiento escalable y compatible con S3</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/backups" className="linkWrapper">
              <div className="iconColumn">
                <div className="icon-box">
                  <span className="icon server-mto"></span>
                </div>
              </div>
              <div className="textColumn">
                <h4>Copias de seguridad</h4>
                <p>Automatiza y protege tu información más importante</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuProducto;
