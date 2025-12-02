// src/pages/Menu.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/prueba/Menu.css";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Empleados", path: "/empleados" },
    { name: "Préstamos", path: "/prestamos" },
    { name: "Pagos", path: "/pagos" },
    { name: "Reportes", path: "/reportes" },
  ];

    const salir = () => {
    navigate("/login");
  };

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

                {/* Botón salir */}
        <button className="menu-link salir" onClick={salir}>
          Salir
        </button>
      </nav>
    </header>
  );
}
