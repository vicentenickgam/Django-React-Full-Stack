import React, { useState } from "react";
import Menu from "./Menu";
import "../../styles/prueba/Pagos.css";

export default function Pagos({ setPage }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="pagos-container">
      <Menu setPage={setPage} />

      <div className="pagos-card">
        <div className="pagos-header">
          <h3>Pagos</h3>
          <button onClick={handleOpenModal} className="new-payment-btn">
            💳 Registrar Pago
          </button>
        </div>

        <table className="pagos-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Préstamo</th>
              <th>Fecha</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>Préstamo #1</td>
              <td>2025-07-01</td>
              <td>$50.000</td>
            </tr>
            <tr>
              <td>María López</td>
              <td>Préstamo #2</td>
              <td>2025-08-14</td>
              <td>$80.000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* === Modal Nuevo Pago === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-title">Registrar Pago</h3>

            <input type="text" placeholder="Cliente" className="modal-input" />
            <input
              type="text"
              placeholder="Número de Préstamo"
              className="modal-input"
            />
            <input type="date" className="modal-input" />
            <input type="number" placeholder="Monto" className="modal-input" />

            <div className="modal-actions">
              <button onClick={handleCloseModal} className="cancel-btn">
                Cancelar
              </button>
              <button className="save-btn">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
