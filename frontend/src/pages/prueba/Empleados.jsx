// /pages/prueba/Empleados.jsx
import React, { useState } from "react";
import Menu from "./Menu";
import "../../styles/prueba/Empleados.css";

export default function Empleados() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="empleados-container">
      <Menu />

      <div className="empleados-card">
        <div className="empleados-header">
          <h3 className="font-bold text-lg">Empleados</h3>
          <button
            onClick={() => setShowModal(true)}
            className="new-employee-btn"
          >
            👤 Nuevo Empleado
          </button>
        </div>

        <table className="empleados-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Cargo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>123456789</td>
              <td>Administrador</td>
              <td>Activo</td>
            </tr>
            <tr>
              <td>María López</td>
              <td>987654321</td>
              <td>Operario</td>
              <td>Activo</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* === Modal de Nuevo Empleado === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Nuevo Empleado</h3>

            <input type="text" placeholder="Nombre" className="modal-input" />
            <input type="text" placeholder="Documento" className="modal-input" />
            <input type="text" placeholder="Cargo" className="modal-input" />
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
