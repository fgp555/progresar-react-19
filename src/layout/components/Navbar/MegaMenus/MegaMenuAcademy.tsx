import { NavLink } from "react-router-dom";

const MegaMenuAcademy = () => {
  return (
    <div className="megaMenu">
      <div className="megaMenuContent">
        <NavLink to="/academy" className="closeMegaMenu">
          <h3 className="menuTitle">Academia</h3>
        </NavLink>
        <div className="megaMenuColumns">
          <div className="menuItem">
            <NavLink to="/academy/devops/aws" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-server"></i>
              </div>
              <div className="textColumn">
                <h4>DevOps</h4>
                <p>Integra desarrollo y operaciones para un software eficiente y rápido.</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/academy/api/whatsapp" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-code"></i>
              </div>
              <div className="textColumn">
                <h4>API</h4>
                <p>Aprende a diseñar y consumir APIs para integrar aplicaciones.</p>
              </div>
            </NavLink>
          </div>

          <div className="menuItem">
            <NavLink to="/academy/mobile/flutter" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-brands fa-flutter"></i>
              </div>
              <div className="textColumn">
                <h4>Flutter</h4>
                <p>Crea apps móviles multiplataforma con Flutter y Dart.</p>
              </div>
            </NavLink>
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default MegaMenuAcademy;
