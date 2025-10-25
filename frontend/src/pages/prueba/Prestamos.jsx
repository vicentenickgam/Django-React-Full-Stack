// src/pages/prueba/Prestamos.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import "../../styles/prueba/Prestamos.css";

export default function Prestamos() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // 👈 ahora usamos useNavigate para cambiar de ruta

  return (
    <div className="prestamos-container">
      <Menu />

      <div className="prestamos-card">
        <div className="prestamos-header">
          <h3 className="font-bold text-lg">Préstamos</h3>

          {/* Botón para abrir el modal de nuevo préstamo */}
          <button onClick={() => setShowModal(true)} className="new-loan-btn">
            💰 Nuevo Préstamo
          </button>
        </div>

        <table className="prestamos-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Cuotas</th>
              <th>Saldo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>$100.000</td>
              <td>2 cuotas</td>
              <td>$56.000</td>
              <td>Activo</td>
              <td>
                {/* 👇 Usamos navigate para ir a la ruta del detalle */}
                <button
                  className="ver-detalle-btn"
                  onClick={() => navigate("/prueba/detalle-prestamo")}
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* === Modal de Nuevo Préstamo === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Nuevo Préstamo</h3>

            <input type="text" placeholder="Cliente" className="modal-input" />
            <input type="number" placeholder="Valor" className="modal-input" />
            <input
              type="number"
              placeholder="Número de Cuotas"
              className="modal-input"
            />
            <select className="modal-input">
              <option>Activo</option>
              <option>Inactivo</option>
            </select>

            <div className="modal-actions">
              <button
                className="btn-cancelar"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-guardar" 
                onClick={() => setShowModal(false)}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
