import React, { useEffect, useRef, useState } from "react";
import "./WhatsAppButton.scss";
import { siteInfo } from "@/config/siteInfo";

const WhatsAppButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [_, setWasAutoOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mostrar 3 segundos al cargar
  useEffect(() => {
    setIsExpanded(true);
    setWasAutoOpened(true);

    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Cerrar al hacer clic fuera (si fue clic manual)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Alternar al hacer clic en el botón
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded((prev) => !prev);
    setWasAutoOpened(false); // para evitar que lo cierre el timeout si fue clic manual
  };

  return (
    <div className="whatsapp-button-container" ref={containerRef}>
      <div className={`whatsapp-message ${isExpanded ? "expand" : "collapse"}`}>
        <p className="whatsapp-message-text">
          <small>
            👋 ¡Hola! Soy Frank,
            <br />
            instructor y desarrollador.
          </small>
          <br />
          ¿En qué puedo ayudarte?
        </p>

        <ul>
          <li>
            <a
              href={`https://wa.me/${siteInfo.whatsappNumber}?text=Hola%2C%20me%20interesa%20un%20sistema%20web%20completo%20(front%20%2B%20back)%20para%20mi%20negocio...`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🌐 Desarrollar sistema web a medida
            </a>
          </li>
          <li>
            <a
              href={`https://wa.me/${siteInfo.whatsappNumber}?text=Hola%2C%20quiero%20automatizar%20mensajes%20en%20mi%20WhatsApp%20Business.%20Estoy%20interesado%20en%20una%20solución%20automática...`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🤖 Automatización por WhatsApp
            </a>
          </li>
          <li>
            <a
              href={`https://wa.me/${siteInfo.whatsappNumber}?text=Hola%2C%20quiero%20consultoría%20o%20mentoría%20en%20desarrollo%20web...`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🎓 Mentoría / resolver dudas de desarrollo
            </a>
          </li>
          <li>
            <a
              href={`https://wa.me/${siteInfo.whatsappNumber}?text=Hola%2C%20necesito%20asistencia%20técnica%20con%20mi%20servidor%2C%20cPanel%2C%20o%20AWS...`}
              target="_blank"
              rel="noopener noreferrer"
            >
              ☁️ Ayuda con despliegues (cPanel, AWS, etc.)
            </a>
          </li>
        </ul>
      </div>

      <a href="#" onClick={toggleMenu} className="whatsapp-button" aria-label="Abrir opciones de soporte por WhatsApp">
        <i className="fab fa-whatsapp fa-lg"></i>
      </a>
    </div>
  );
};

export default WhatsAppButton;
