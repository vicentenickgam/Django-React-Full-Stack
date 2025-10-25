// src/pages/prueba/DetallePrestamo.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import "../../styles/prueba/Prestamos.css";

export default function DetallePrestamo() {
  const navigate = useNavigate(); // 👈 Hook de navegación

  return (
    <div className="prestamos-container">
      <Menu />

      <div className="prestamos-card">
        <div className="detalle-info">
          <p>
            <strong>Cliente:</strong> Juan Pérez
          </p>
          <p>
            <strong>Valor:</strong> $100.000
          </p>
          <p>
            <strong>Cuotas:</strong> 2 cuotas
          </p>
          <p>
            <strong>Saldo:</strong> $56.000
          </p>
        </div>

        <h3 className="font-bold text-lg mt-4">Historial de Pagos</h3>

        <table className="prestamos-table mt-2">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Saldo Restante</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-07-01</td>
              <td>$50.000</td>
              <td>$56.000</td>
            </tr>
          </tbody>
        </table>

        {/* 👇 Botón para volver a la lista de préstamos */}
        <div className="mt-4 text-right">
          <button
            className="btn-volver"
            onClick={() => navigate("/prueba/prestamos")}
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
