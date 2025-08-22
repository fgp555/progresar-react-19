import { NavLink } from "react-router-dom";

const MegaMenuTools = () => {
  return (
    <div className="megaMenu">
      <div className="megaMenuContent">
        <NavLink to="/tools" className="closeMegaMenu">
          <h3 className="menuTitle">Herramientas</h3>
        </NavLink>
        <div className="megaMenuColumns">
          {/* Decodificar Token */}
          <div className="menuItem">
            <NavLink to="/tools/decode-token" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-key"></i>
              </div>
              <div className="textColumn">
                <h4>Decodificar Token</h4>
                <p>Analiza y visualiza el contenido de tu JWT de forma segura.</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuTools;
