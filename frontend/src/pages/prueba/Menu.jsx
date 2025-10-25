// src/pages/prueba/Menu.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/prueba/Menu.css";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/prueba/dashboard" },
    { name: "Empleados", path: "/prueba/empleados" },
    { name: "Préstamos", path: "/prueba/prestamos" },
    { name: "Pagos", path: "/prueba/pagos" },
    { name: "Reportes", path: "/prueba/reportes" },
  ];

  return (
    <header className="menu-container">
      <h1 className="menu-title">Sistema de préstamos</h1>

      <nav className="menu-links">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`menu-link ${
              location.pathname === link.path ? "active" : ""
            }`}
          >
            {link.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
