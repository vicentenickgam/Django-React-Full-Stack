import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import "../styles/prueba/Empleados.css";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    documento: "",
    cargo: "",
    empresa: "",
    estado: "Activo",
    fecha_ingreso: "",
    fecha_corte: "",
    devengado: "",
  });

  const [resultados, setResultados] = useState({
    total_dias: 0,
    acumulado_ps: 0,
  });

  const API = "http://127.0.0.1:8000/api";

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const obtenerEmpleados = async () => {
    try {
      const res = await axios.get(`${API}/empleados/`);
      setEmpleados(res.data);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
    }
  };

  const calcularValores = () => {
    const { fecha_ingreso, fecha_corte, devengado } = nuevoEmpleado;
    if (fecha_ingreso && fecha_corte && devengado) {
      const f1 = new Date(fecha_ingreso);
      const f2 = new Date(fecha_corte);
      const total_dias = Math.max(
        0,
        Math.floor((f2.getTime() - f1.getTime()) / (1000 * 60 * 60 * 24))
      );
      // Calcular Acumulado PS = ((devengado / 30) * días) * 0.2121
      const acumulado_ps = ((Number(devengado) / 30) * total_dias) * 0.2121;
      setResultados({
        total_dias,
        acumulado_ps: Number(acumulado_ps.toFixed(2)),
      });
    } else {
      setResultados({ total_dias: 0, acumulado_ps: 0 });
    }
  };

  useEffect(() => {
    calcularValores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nuevoEmpleado.fecha_ingreso,
    nuevoEmpleado.fecha_corte,
    nuevoEmpleado.devengado,
  ]);

  const crearEmpleado = async () => {
    try {
      const payload = {
        nombre: nuevoEmpleado.nombre,
        documento: nuevoEmpleado.documento,
        cargo: nuevoEmpleado.cargo,
        empresa: nuevoEmpleado.empresa,
        estado: nuevoEmpleado.estado,
        fecha_ingreso: nuevoEmpleado.fecha_ingreso || null,
        fecha_corte: nuevoEmpleado.fecha_corte || null,
        devengado: nuevoEmpleado.devengado ? Number(nuevoEmpleado.devengado) : 0,
        tiempo_dias: resultados.total_dias,
        acumulado_ps: resultados.acumulado_ps,
      };

      console.log("📤 Enviando datos al backend:", payload);

      await axios.post(`${API}/empleados/`, payload);

      setShowModal(false);
      setNuevoEmpleado({
        nombre: "",
        documento: "",
        cargo: "",
        empresa: "",
        estado: "Activo",
        fecha_ingreso: "",
        fecha_corte: "",
        devengado: "",
      });
      setResultados({ total_dias: 0, acumulado_ps: 0 });
      obtenerEmpleados();
    } catch (err) {
      console.error("Error al crear empleado:", err.response || err);
      alert("Error al crear empleado. Revisa la consola.");
    }
  };

  const formatMoney = (v) =>
    v === null || v === undefined || v === ""
      ? "—"
      : Number(v).toLocaleString();

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

        <div style={{ overflowX: "auto" }}>
          <table className="empleados-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Cargo</th>
                <th>Empresa</th>
                <th>Fecha Ingreso</th>
                <th>Fecha Corte</th>
                <th>Tiempo (días)</th>
                <th>Devengado</th>
                <th>Acumulado PS</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {empleados.length > 0 ? (
                empleados.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.nombre}</td>
                    <td>{emp.documento}</td>
                    <td>{emp.cargo}</td>
                    <td>{emp.empresa || "—"}</td>
                    <td>{emp.fecha_ingreso || "—"}</td>
                    <td>{emp.fecha_corte || "—"}</td>
                    <td>
                      {emp.tiempo_dias ?? emp.tiempo_dias === 0
                        ? emp.tiempo_dias
                        : "—"}
                    </td>
                    <td>
                      {emp.devengado ? `$${formatMoney(emp.devengado)}` : "—"}
                    </td>
                    <td>
                      {emp.acumulado_ps
                        ? `$${formatMoney(emp.acumulado_ps)}`
                        : "—"}
                    </td>
                    <td>{emp.estado}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No hay empleados registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === Modal === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Nuevo Empleado</h3>

            <input
              type="text"
              placeholder="Nombre"
              className="modal-input"
              value={nuevoEmpleado.nombre}
              onChange={(e) =>
                setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Documento"
              className="modal-input"
              value={nuevoEmpleado.documento}
              onChange={(e) =>
                setNuevoEmpleado({
                  ...nuevoEmpleado,
                  documento: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Cargo"
              className="modal-input"
              value={nuevoEmpleado.cargo}
              onChange={(e) =>
                setNuevoEmpleado({ ...nuevoEmpleado, cargo: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Empresa"
              className="modal-input"
              value={nuevoEmpleado.empresa}
              onChange={(e) =>
                setNuevoEmpleado({ ...nuevoEmpleado, empresa: e.target.value })
              }
            />

            <label>Fecha de ingreso:</label>
            <input
              type="date"
              className="modal-input"
              value={nuevoEmpleado.fecha_ingreso}
              onChange={(e) =>
                setNuevoEmpleado({
                  ...nuevoEmpleado,
                  fecha_ingreso: e.target.value,
                })
              }
            />

            <label>Fecha de corte:</label>
            <input
              type="date"
              className="modal-input"
              value={nuevoEmpleado.fecha_corte}
              onChange={(e) =>
                setNuevoEmpleado({
                  ...nuevoEmpleado,
                  fecha_corte: e.target.value,
                })
              }
            />

            <label>Devengado (salario mensual):</label>
            <input
              type="number"
              className="modal-input"
              placeholder="Ej: 1423500"
              value={nuevoEmpleado.devengado}
              onChange={(e) =>
                setNuevoEmpleado({
                  ...nuevoEmpleado,
                  devengado: e.target.value,
                })
              }
            />

            <div className="resultados-box">
              <p>
                <strong>Días trabajados:</strong> {resultados.total_dias}
              </p>
              <p>
                <strong>Acumulado PS (21.21%):</strong> $
                {formatMoney(resultados.acumulado_ps)}
              </p>
            </div>

            <select
              className="modal-input"
              value={nuevoEmpleado.estado}
              onChange={(e) =>
                setNuevoEmpleado({ ...nuevoEmpleado, estado: e.target.value })
              }
            >
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
              <button className="btn-guardar" onClick={crearEmpleado}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
