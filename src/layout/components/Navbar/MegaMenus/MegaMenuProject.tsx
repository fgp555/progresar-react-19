import { NavLink } from "react-router-dom"; // Changed from "react-router-dom" to "react-router-dom" for NavLink

const MegaMenuProject = () => {
  return (
    <div className="megaMenu">
      <div className="megaMenuContent">
        <NavLink to="/projects" className="closeMegaMenu">
          <h3 className="menuTitle">Proyectos</h3>
        </NavLink>
        <div className="megaMenuColumns">
          <div className="menuItem">
            <NavLink to="/projects" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-folder-open"></i> {/* Icon for All Projects */}
              </div>
              <div className="textColumn">
                <h4>Todos los proyectos</h4>
                <p>Explora nuestra cartera completa de desarrollos y soluciones.</p>
              </div>
            </NavLink>
          </div>
          <div className="menuItem">
            <NavLink to="/team" className="linkWrapper">
              <div className="iconColumn">
                <i className="fa-solid fa-users"></i> {/* Icon for Our Team */}
              </div>
              <div className="textColumn">
                <h4>Nuestro equipo</h4>
                <p>Conoce a los profesionales detrás de cada solución innovadora.</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuProject;
