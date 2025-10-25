// src/pages/prueba/Prestamos.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import "../../styles/prueba/Prestamos.css";

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    empleado_id: "",
    valor_solicitado: "",
    fecha_inicio: "",
    numero_cuotas: "",
    valor_cuota: "",
    saldo_actual: "",
    estado: "Activo",
  });

  const navigate = useNavigate();

  // === Obtener préstamos del backend ===
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/prestamos/")
      .then((res) => setPrestamos(res.data))
      .catch((err) => console.error("Error al cargar préstamos:", err));
  }, []);

  // === Guardar nuevo préstamo ===
  const handleGuardar = () => {
    axios
      .post("http://127.0.0.1:8000/api/prestamos/", nuevoPrestamo)
      .then(() => {
        setShowModal(false);
        setNuevoPrestamo({
          empleado_id: "",
          valor_solicitado: "",
          fecha_inicio: "",
          numero_cuotas: "",
          valor_cuota: "",
          saldo_actual: "",
          estado: "Activo",
        });
        return axios.get("http://127.0.0.1:8000/api/prestamos/");
      })
      .then((res) => setPrestamos(res.data))
      .catch((err) => {
        console.error("Error al guardar préstamo:", err.response?.data || err);
        alert("Error al guardar préstamo. Ver consola para más detalles.");
      });
  };

  return (
    <div className="prestamos-container">
      <Menu />

      <div className="prestamos-card">
        <div className="prestamos-header">
          <h3 className="font-bold text-lg">Préstamos</h3>
          <button onClick={() => setShowModal(true)} className="new-loan-btn">
            💰 Nuevo Préstamo
          </button>
        </div>

        <table className="prestamos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Empleado</th>
              <th>Valor</th>
              <th>Cuotas</th>
              <th>Saldo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.empleado_id}</td>
                <td>${p.valor_solicitado}</td>
                <td>{p.numero_cuotas}</td>
                <td>${p.saldo_actual}</td>
                <td>{p.estado}</td>
                <td>
                  <button
                    className="ver-detalle-btn"
                    onClick={() => navigate(`/prueba/detalle-prestamo/${p.id}`)}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === Modal de Nuevo Préstamo === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Nuevo Préstamo</h3>

            <input
              type="number"
              placeholder="ID Empleado"
              className="modal-input"
              value={nuevoPrestamo.empleado_id}
              onChange={(e) =>
                setNuevoPrestamo({
                  ...nuevoPrestamo,
                  empleado_id: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Valor solicitado"
              className="modal-input"
              value={nuevoPrestamo.valor_solicitado}
              onChange={(e) =>
                setNuevoPrestamo({
                  ...nuevoPrestamo,
                  valor_solicitado: e.target.value,
                  saldo_actual: e.target.value, // 👈 inicializa saldo igual al valor solicitado
                })
              }
            />
            <input
              type="date"
              placeholder="Fecha inicio"
              className="modal-input"
              value={nuevoPrestamo.fecha_inicio}
              onChange={(e) =>
                setNuevoPrestamo({
                  ...nuevoPrestamo,
                  fecha_inicio: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Número de cuotas"
              className="modal-input"
              value={nuevoPrestamo.numero_cuotas}
              onChange={(e) =>
                setNuevoPrestamo({
                  ...nuevoPrestamo,
                  numero_cuotas: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Valor de cuota"
              className="modal-input"
              value={nuevoPrestamo.valor_cuota}
              onChange={(e) =>
                setNuevoPrestamo({
                  ...nuevoPrestamo,
                  valor_cuota: e.target.value,
                })
              }
            />
            <select
              className="modal-input"
              value={nuevoPrestamo.estado}
              onChange={(e) =>
                setNuevoPrestamo({ ...nuevoPrestamo, estado: e.target.value })
              }
            >
              <option value="Activo">Activo</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <div className="modal-actions">
              <button
                className="btn-cancelar"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-guardar" onClick={handleGuardar}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
