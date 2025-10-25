// /pages/prueba/Empleados.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import "../../styles/prueba/Empleados.css";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    documento: "",
    cargo: "",
    estado: "Activo",
  });

  // Cargar empleados desde el backend
  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const obtenerEmpleados = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/empleados/");
      setEmpleados(res.data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const crearEmpleado = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/empleados/", nuevoEmpleado);
      setShowModal(false);
      setNuevoEmpleado({ nombre: "", documento: "", cargo: "", estado: "Activo" });
      obtenerEmpleados(); // recargar lista
    } catch (error) {
      console.error("Error al crear empleado:", error);
    }
  };

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
            {empleados.length > 0 ? (
              empleados.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.nombre}</td>
                  <td>{emp.documento}</td>
                  <td>{emp.cargo}</td>
                  <td>{emp.estado}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay empleados registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Modal de Nuevo Empleado === */}
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
                setNuevoEmpleado({ ...nuevoEmpleado, documento: e.target.value })
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
