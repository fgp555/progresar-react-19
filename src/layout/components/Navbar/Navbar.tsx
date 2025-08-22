import "./Navbar.css";
import "./Navbar.mobile.css";
import { NavLink } from "react-router-dom";
import { siteInfo } from "@/config/siteInfo";
import { useAuth } from "@/auth/hooks/useAuth";
import { useTheme } from "@/layout/hooks/useTheme";
import GoogleLoginButton from "@/auth/components/GoogleLoginButton/GoogleLoginButton";
import GoogleProfileChip from "@/auth/components/GoogleProfileChip/GoogleProfileChip";
import LogoutButton from "@/auth/components/LogoutButton/LogoutButton";
import MegaMenuAcademy from "./MegaMenus/MegaMenuAcademy";
import MegaMenuProject from "./MegaMenus/MegaMenuProject";
import MegaMenuTools from "./MegaMenus/MegaMenuTools";
import React, { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileView /* setIsMobileView */] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveMenu(null);
    setIsDesktopMenuOpen(false);
  };

  const handleClick = (menu: string) => {
    setActiveMenu((prevActiveMenu) => {
      const shouldOpen = prevActiveMenu === menu ? null : menu;
      setIsDesktopMenuOpen(shouldOpen !== null);
      return shouldOpen;
    });
  };

  useEffect(() => {
    const shouldBlockScroll = isMobileView ? menuOpen : isDesktopMenuOpen;

    if (shouldBlockScroll) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [menuOpen, isDesktopMenuOpen, isMobileView]);

  return (
    <>
      <nav className={`navbar-container ${theme === "dark-mode" ? "dark" : "light"}`}>
        <div className={`menuContainer ${menuOpen ? "active" : ""}`}>
          <ul className="navbarLeft">
            <NavLink to="/" className="logoLink">
              <img className="logoImg" width={32} height={32} src={siteInfo.faviconSVG} alt="Logo" />
            </NavLink>
            <aside className="navbarCenter">
              <div>
                <NavLink to="/" className={({ isActive }) => (isActive ? "navLinkActive" : "navLink")}>
                  <li className="navItem">Inicio</li>
                </NavLink>

                <NavLink to="/services" className={({ isActive }) => (isActive ? "navLinkActive" : "navLink")}>
                  <li className="navItem">Servicios</li>
                </NavLink>

                <li
                  className={`navItem ${activeMenu === "productos" ? "active" : ""}`}
                  onClick={() => handleClick("productos")}
                >
                  <article className="accordion-toggle">
                    <span className="accordion-title">Proyectos</span>
                    <span className={`chevronIcon ${activeMenu === "productos" ? "chevronUp" : ""}`}>
                      <i className="fa-solid fa-chevron-down fa-sm"></i>
                    </span>
                  </article>
                  {activeMenu === "productos" && <MegaMenuProject />}
                </li>
                <li
                  className={`navItem ${activeMenu === "recursos" ? "active" : ""}`}
                  onClick={() => handleClick("recursos")}
                >
                  <article className="accordion-toggle">
                    <span className="accordion-title">Academia</span>
                    <span className={`chevronIcon ${activeMenu === "recursos" ? "chevronUp" : ""}`}>
                      <i className="fa-solid fa-chevron-down fa-sm"></i>
                    </span>
                  </article>
                  {activeMenu === "recursos" && <MegaMenuAcademy />}
                </li>
                <li
                  className={`navItem ${activeMenu === "tools" ? "active" : ""}`}
                  onClick={() => handleClick("tools")}
                >
                  <article className="accordion-toggle">
                    <span className="accordion-title">Tools</span>
                    <span className={`chevronIcon ${activeMenu === "tools" ? "chevronUp" : ""}`}>
                      <i className="fa-solid fa-chevron-down fa-sm"></i>
                    </span>
                  </article>
                  {activeMenu === "tools" && <MegaMenuTools />}
                </li>
              </div>
              <div className="navbarButtons">
                <article className="iconContainer">
                  <div className="icon-box">
                    <i onClick={toggleTheme} className={theme === "dark-mode" ? "icon sun-mro" : "icon moon-mro"}></i>
                  </div>
                </article>
                <article className="buttonsAuth">
                  {isAuthenticated ? (
                    <>
                      <GoogleProfileChip />
                      <LogoutButton />
                    </>
                  ) : (
                    <>
                      <GoogleLoginButton />
                      <GoogleLoginButton textButton="Registrarse" className="buttonRegister" />
                    </>
                  )}
                </article>
              </div>
            </aside>
          </ul>

          <div className="menuIconMobile" onClick={toggleMenu}>
            {!menuOpen ? (
              <div className="icon-box">
                <span className="icon menu-mro"></span>
              </div>
            ) : (
              <div className="icon-box">
                <span className="icon x-mro"></span>
              </div>
            )}
          </div>
        </div>
        {activeMenu !== null && isDesktopMenuOpen && (
          <div
            className="megaMenuOverlay"
            onClick={() => {
              setActiveMenu(null);
              setIsDesktopMenuOpen(false);
            }}
          ></div>
        )}
      </nav>
      <div style={{ height: "65px" }}></div>
    </>
  );
};

export default Navbar;
