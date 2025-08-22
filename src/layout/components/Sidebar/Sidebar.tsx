import "./Sidebar.css";
import type { MenuKeyType, SubMenuType } from "./interface/interface";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/hooks/useAuth";
import LoagingComp from "@/components/LoagingComp/LoagingComp";
import { useTheme } from "@/layout/hooks/useTheme";

const initialSubMenus: SubMenuType = {
  orders: false,
  users: false,
  operator: false,
  setting: false,
  application: false,
};

const initialSidebarOpen = () => {
  if (window.innerWidth < 768) return false;
  const savedSidebar = localStorage.getItem("sidebar");
  if (savedSidebar) return JSON.parse(savedSidebar);
  return true;
};

const Sidebar = () => {
  const [subMenus, setSubMenus] = useState<SubMenuType>(initialSubMenus);
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen());

  const { userStatePhoto, userState, logout, loading, hasPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const currentPath = location.pathname.replace("/dashboard/", "");

  const handleSubMenu = () => {
    if (window.innerWidth < 768) return;
    if (currentPath.startsWith("order")) setSubMenus({ ...initialSubMenus, orders: true });
    if (currentPath.startsWith("user")) setSubMenus({ ...initialSubMenus, users: true });
    if (currentPath.startsWith("operator")) setSubMenus({ ...initialSubMenus, operator: true });
    if (currentPath.startsWith("setting")) setSubMenus({ ...initialSubMenus, setting: true });
    if (currentPath.startsWith("application")) setSubMenus({ ...initialSubMenus, application: true });
  };

  useEffect(() => {
    if (sidebarOpen) handleSubMenu();
  }, []);

  const toggleSidebar = () => {
    sidebarOpen ? setSubMenus(initialSubMenus) : handleSubMenu();
    const newSidebarState = !sidebarOpen;
    setSidebarOpen(newSidebarState);
    localStorage.setItem("sidebar", JSON.stringify(newSidebarState));
  };

  const toggleSubMenu = (menu: MenuKeyType) => {
    setSidebarOpen(true);
    setSubMenus((prev) => {
      const newState = { ...prev, [menu]: !prev[menu] };
      Object.keys(prev).forEach((key) => {
        const typedKey = key as MenuKeyType;
        newState[typedKey] = typedKey === menu ? !prev[typedKey] : false;
      });
      return newState;
    });
  };

  return (
    <nav id="sidebar-comp" className={`${sidebarOpen ? "" : "close"} dn-mobile`}>
      {loading && <LoagingComp mensaje={"Cerrando sesión..."} />}
      <ul className="top">
        <li className="logo-container">
          <NavLink to="/" className="sidebar-Navlink">
            <img className="logo" src={`/logo${theme === "dark-mode" ? "-dark" : ""}.svg`} alt="" />
          </NavLink>
          <button onClick={toggleSidebar} id="toggle-btn" className={`${sidebarOpen ? "rotate" : ""}`}>
            <i className="fa-solid fa-angles-right"></i>
          </button>
        </li>
        <li className="activea">
          <NavLink to="/dashboard" end>
            <i className="fa-solid fa-house"></i>
            <span>Inicio</span>
          </NavLink>
        </li>
        {!hasPermission(["superadmin", "admin", "collaborator"]) && (
          <li>
            <NavLink to="/dashboard/project/list" end>
              <i className="fa-solid fa-briefcase"></i>
              <span>Proyectos</span>
            </NavLink>
          </li>
        )}

        {hasPermission(["superadmin", "admin", "collaborator"]) && (
          <li>
            <button
              onClick={() => toggleSubMenu("orders")}
              className={`dropdown-btn ${subMenus.orders ? "rotate" : ""}`}
            >
              <i className="fa-solid fa-briefcase"></i>
              <span>Proyectos</span>
              <i className="fa-solid fa-angle-down"></i>
            </button>
            <ul className={`sub-menu ${subMenus.orders ? "show" : ""}`}>
              <div>
                <NavLink to="/dashboard/project/list">Proyectos</NavLink>
                <NavLink to="/dashboard/project/user/list">Usuarios</NavLink>
              </div>
            </ul>
          </li>
        )}
        {hasPermission(["superadmin", "admin"]) && (
          <>
            <li>
              <button
                onClick={() => toggleSubMenu("users")}
                className={`dropdown-btn ${subMenus.users ? "rotate" : ""}`}
              >
                <i className="fa-solid fa-users"></i>
                <span>Usuarios</span>
                <i className="fa-solid fa-angle-down"></i>
              </button>
              <ul className={`sub-menu ${subMenus.users ? "show" : ""}`}>
                <div>
                  <NavLink to="/dashboard/user/list">Users</NavLink>
                  <NavLink to="/dashboard/user/connected">Connected</NavLink>
                </div>
              </ul>
            </li>

            {hasPermission(["superadmin", "admin"]) && (
              <li>
                <button
                  onClick={() => toggleSubMenu("application")}
                  className={`dropdown-btn ${subMenus.application ? "rotate" : ""}`}
                >
                  <i className="fa-solid fa-screwdriver-wrench"></i>
                  <span>App</span>
                  <i className="fa-solid fa-angle-down"></i>
                </button>
                <ul className={`sub-menu ${subMenus.application ? "show" : ""}`}>
                  <div>
                    <NavLink to="/dashboard/application/stat">Stat</NavLink>
                    <NavLink to="/dashboard/application/shortener">Shortener</NavLink>
                    <NavLink to="/dashboard/application/whatsapp">WhatsApp</NavLink>
                  </div>
                </ul>
              </li>
            )}
          </>
        )}
      </ul>

      <ul className="botton">
        <li>
          {sidebarOpen && (
            <section className="user-info">
              <div>{userStatePhoto && <img src={userStatePhoto} alt={userState?.name || "Usuario"} />}</div>

              <div className="user-name">
                <span>{userState?.name}</span>
              </div>

              {userState?.role === "admin" ? (
                <div className="user-role">
                  <span>Administrador</span>
                </div>
              ) : userState?.role === "superadmin" ? (
                <div className="user-role superadmin">
                  <span>SuperAdmin</span>
                </div>
              ) : (
                <span>Invitado / Visitante</span>
              )}
            </section>
          )}
          <hr className="hr" />
          <br />
        </li>
        {hasPermission(["superadmin", "admin"]) && (
          <li>
            <button
              onClick={() => toggleSubMenu("setting")}
              className={`dropdown-btn ${subMenus.setting ? "rotate" : ""}`}
            >
              <i className="fa-solid fa-gear"></i>
              <span>Configuración</span>
              <i className="fa-solid fa-angle-down"></i>
            </button>
            <ul className={`sub-menu ${subMenus.setting ? "show" : ""}`}>
              <div>
                <NavLink to="/dashboard/setting/info">Info</NavLink>
                <NavLink to={`/dashboard/setting/profile`}>Mi Perfil</NavLink>
                <NavLink to="/dashboard/setting/options">Opciones</NavLink>
                <NavLink to="/dashboard/setting/database">Base de datos</NavLink>
              </div>
            </ul>
          </li>
        )}
        {!hasPermission(["superadmin", "admin"]) && (
          <li>
            <NavLink to="/dashboard/setting/profile" end>
              <i className="fa-solid fa-user"></i>
              <span>Mi Perfil</span>
            </NavLink>
          </li>
        )}
        <span className="dropdown-btn" onClick={toggleTheme}>
          <i className={theme === "dark-mode" ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
          <span>{theme === "dark-mode" ? "Modo Claro" : "Modo Oscuro"}</span>
        </span>
        <span className="dropdown-btn logout" onClick={logout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Cerrar sesión</span>
        </span>
      </ul>
    </nav>
  );
};

export default Sidebar;
