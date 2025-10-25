// /pages/prueba/Dashboard.jsx
import React from "react";
import Menu from "./Menu";
import "../../styles/prueba/Dashboard.css";

export default function Dashboard({ setPage }) {
  return (
    <div className="dashboard-container">
      <Menu setPage={setPage} />
      <h2 className="text-2xl font-bold mt-4">Dashboard</h2>

      {/* Tarjetas */}
      <div className="cards">
        <div className="card card-blue">
          <p>Total Prestado</p>
          <h3>$12.000.000</h3>
        </div>
        <div className="card card-green">
          <p>Total Abonado</p>
          <h3>$8.000.000</h3>
        </div>
        <div className="card card-yellow">
          <p>Cuotas Pendientes</p>
          <h3>15</h3>
        </div>
      </div>

      {/* Gráficos */}
      <div className="graphs">
        <div className="graph-box">
          <h3>Gráfico de Préstamos</h3>
          <div className="graph-inner"></div>
        </div>
        <div className="distribution-box">
          <h3>Distribución</h3>
          <div className="distribution-inner"></div>
        </div>
      </div>

      {/* Últimos préstamos */}
      <div className="last-loans">
        <h3 className="font-bold mb-2">Últimos Préstamos</h3>
        <ul>
          <li>1. Juan Pérez — $10,000 — 12 cuotas — saldo $8,000</li>
          <li>2. María López — $15,000 — 10 cuotas — saldo $6,000</li>
          <li>3. Carlos Gómez — $20,000 — 8 cuotas — saldo $12,000</li>
        </ul>
      </div>
    </div>
  );
}
