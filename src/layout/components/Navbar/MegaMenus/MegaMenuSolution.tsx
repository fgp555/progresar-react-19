import { NavLink } from "react-router-dom";

const MegaMenuSolution = () => {
  return (
    <div className="megaMenu">
      <div className="megaMenuContent">
        <NavLink to="/solutions" className="closeMegaMenu">
          <h3 className="menuTitle">Soluciones</h3>
        </NavLink>
        <div className="megaMenuColumns">
          <div className="menuItem">
            <NavLink to="/solutions/web-design" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-paintbrush"></i> {/* Icon for Web Design */}
              </div>
              <div className="textColumn">
                <h4>Diseño web</h4>
                <p>Creamos sitios web atractivos y funcionales para tu marca.</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/solutions/web-app" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-globe"></i> {/* Icon for Web Applications */}
              </div>
              <div className="textColumn">
                <h4>Aplicaciones Web</h4>
                <p>Desarrollamos aplicaciones web robustas y escalables a medida.</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/solutions/api" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-handshake-angle"></i> {/* Icon for Backend API (Integration) */}
              </div>
              <div className="textColumn">
                <h4>Backend API</h4>
                <p>Construimos APIs seguras para integrar y potenciar tus servicios.</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/solutions/whatsapp" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-brands fa-whatsapp"></i> {/* Icon for WhatsApp Bot */}
              </div>
              <div className="textColumn">
                <h4>Automatización de WhatsApp</h4>
                <p>Mejora la comunicación y atención al cliente con bots de WhatsApp.</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/solutions/mobile" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-mobile-screen-button"></i> {/* Icon for Mobile Applications */}
              </div>
              <div className="textColumn">
                <h4>Aplicaciones moviles</h4>
                <p>Desarrollamos apps nativas e híbridas para iOS y Android.</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/solutions/componentes" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-cubes"></i> {/* Icon for Software Components */}
              </div>
              <div className="textColumn">
                <h4>Componentes Web</h4>
                <p>Optimiza tus proyectos freelance con componentes de software reutilizables.</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuSolution;
