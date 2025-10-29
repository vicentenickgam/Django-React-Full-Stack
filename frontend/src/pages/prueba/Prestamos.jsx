import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import "../../styles/prueba/Prestamos.css";

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    empleado_id: "", // 👈 cambiado: antes era empleado
    valor_solicitado: "",
    fecha_inicio: "",
    numero_cuotas: "",
    valor_cuota: "",
    saldo_actual: "",
    estado: "Activo",
  });

  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api";

  // === Cargar préstamos y empleados ===
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [prestamosRes, empleadosRes] = await Promise.all([
          axios.get(`${API_URL}/prestamos/`),
          axios.get(`${API_URL}/empleados/`),
        ]);
        setPrestamos(prestamosRes.data);
        setEmpleados(empleadosRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, []);

  // === Calcular valor de cuota automáticamente ===
  const calcularValorCuota = (valor, cuotas) => {
    if (!valor || !cuotas) return "";
    const interes = 0.1; // 10%
    const totalConInteres = parseFloat(valor) * (1 + interes);
    return (totalConInteres / parseInt(cuotas)).toFixed(2);
  };

  // === Manejar cambios en el formulario ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    const prestamoActualizado = { ...nuevoPrestamo, [name]: value };

    if (name === "valor_solicitado" || name === "numero_cuotas") {
      prestamoActualizado.valor_cuota = calcularValorCuota(
        name === "valor_solicitado" ? value : nuevoPrestamo.valor_solicitado,
        name === "numero_cuotas" ? value : nuevoPrestamo.numero_cuotas
      );
      prestamoActualizado.saldo_actual =
        name === "valor_solicitado" ? value : nuevoPrestamo.saldo_actual;
    }

    setNuevoPrestamo(prestamoActualizado);
  };

  // === Guardar nuevo préstamo ===
  const handleGuardar = async () => {
    try {
      const payload = {
        empleado_id: parseInt(nuevoPrestamo.empleado_id), // 👈 nombre correcto
        valor_solicitado: parseFloat(nuevoPrestamo.valor_solicitado),
        fecha_inicio: nuevoPrestamo.fecha_inicio,
        numero_cuotas: parseInt(nuevoPrestamo.numero_cuotas),
        valor_cuota: parseFloat(nuevoPrestamo.valor_cuota),
        saldo_actual: parseFloat(nuevoPrestamo.saldo_actual),
        estado: nuevoPrestamo.estado,
      };

      await axios.post(`${API_URL}/prestamos/`, payload);

      // Refrescar lista
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

      const res = await axios.get(`${API_URL}/prestamos/`);
      setPrestamos(res.data);

    } catch (err) {
      console.error("Error al guardar préstamo:", err.response?.data || err);
      alert("❌ Error al guardar préstamo. Ver consola para más detalles.");
    }
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
              <th>Empresa</th>
              <th>Valor Solicitado</th>
              <th>Cuotas</th>
              <th>Pagadas</th>
              <th>Saldo Actual</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.empleado?.nombre || "Desconocido"}</td>
                <td>{p.empleado?.empresa || "—"}</td>
                <td>${parseFloat(p.valor_solicitado).toLocaleString()}</td>
                <td>{p.numero_cuotas}</td>
                <td>{p.cuotas_pagadas ?? 0} / {p.numero_cuotas}</td>
                <td>${parseFloat(p.saldo_actual).toLocaleString()}</td>
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

            <select
              name="empleado_id" 
              className="modal-input"
              value={nuevoPrestamo.empleado_id}
              onChange={handleChange}
            >
              <option value="">Seleccionar Empleado</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} ({emp.empresa})
                </option>
              ))}
            </select>

            <input
              type="number"
              name="valor_solicitado"
              placeholder="Valor solicitado"
              className="modal-input"
              value={nuevoPrestamo.valor_solicitado}
              onChange={handleChange}
            />

            <input
              type="date"
              name="fecha_inicio"
              className="modal-input"
              value={nuevoPrestamo.fecha_inicio}
              onChange={handleChange}
            />

            <input
              type="number"
              name="numero_cuotas"
              placeholder="Número de cuotas"
              className="modal-input"
              value={nuevoPrestamo.numero_cuotas}
              onChange={handleChange}
            />

            <input
              type="text"
              name="valor_cuota"
              placeholder="Valor de cuota"
              className="modal-input"
              value={nuevoPrestamo.valor_cuota}
              readOnly
            />

            <select
              name="estado"
              className="modal-input"
              value={nuevoPrestamo.estado}
              onChange={handleChange}
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
