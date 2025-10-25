import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import "../../styles/prueba/Pagos.css";

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoPago, setNuevoPago] = useState({
    prestamo: "",
    fecha_pago: "",
    monto_abono: "",
  });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const API_URL = "http://127.0.0.1:8000/api";

  // 🔹 Cargar lista de pagos y préstamos
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const res = await fetch(`${API_URL}/pagos/`);
        if (!res.ok) throw new Error("Error al obtener los pagos");
        const data = await res.json();
        setPagos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPrestamos = async () => {
      try {
        const res = await fetch(`${API_URL}/prestamos/`);
        if (!res.ok) throw new Error("Error al obtener préstamos");
        const data = await res.json();
        setPrestamos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPagos();
    fetchPrestamos();
  }, []);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    setNuevoPago({ ...nuevoPago, [e.target.name]: e.target.value });
  };

  // 🔹 Registrar un nuevo pago
  const handleGuardarPago = async () => {
    if (!nuevoPago.prestamo || !nuevoPago.fecha_pago || !nuevoPago.monto_abono) {
      setMensaje("⚠️ Todos los campos son obligatorios.");
      return;
    }

    // Ajuste importante: Django espera "prestamo_id", no "prestamo"
const pagoConSaldo = {
  prestamo: Number(nuevoPago.prestamo),  // 👈 importante: debe ser "prestamo", no "prestamo_id"
  fecha_pago: nuevoPago.fecha_pago,
  monto_abono: Number(nuevoPago.monto_abono),
  saldo_despues_pago: 0,
};

    try {
      const res = await fetch(`${API_URL}/pagos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pagoConSaldo),
      });

      if (!res.ok) throw new Error("Error al registrar el pago");

      const pagoGuardado = await res.json();
      setPagos([...pagos, pagoGuardado]);
      setMensaje("✅ Pago registrado correctamente.");
      setShowModal(false);
      setNuevoPago({ prestamo: "", fecha_pago: "", monto_abono: "" });

      // Ocultar mensaje después de unos segundos
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error(error);
      setMensaje("❌ No se pudo registrar el pago.");
    }
  };

  if (loading) return <div className="pagos-container">Cargando pagos...</div>;

  return (
    <div className="pagos-container">
      <Menu />

      <div className="pagos-card">
        <div className="pagos-header">
          <h3>Pagos</h3>
          <button onClick={() => setShowModal(true)} className="new-payment-btn">
            💳 Registrar Pago
          </button>
        </div>

        {/* Mostrar mensaje */}
        {mensaje && (
          <div
            className={`mensaje ${
              mensaje.includes("✅")
                ? "text-green-600"
                : mensaje.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {mensaje}
          </div>
        )}

        {/* Tabla de pagos */}
        <table className="pagos-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Préstamo</th>
              <th>Fecha de Pago</th>
              <th>Monto Abonado</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length > 0 ? (
              pagos.map((pago) => (
                <tr key={pago.id}>
                  <td>{pago.empleado_nombre || "Desconocido"}</td>
                  <td>Préstamo #{pago.prestamo?.id}</td>
                  <td>{pago.fecha_pago}</td>
                  <td>${Number(pago.monto_abono).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500">
                  No hay pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Modal Nuevo Pago === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-title">Registrar Pago</h3>

            {/* Seleccionar préstamo */}
            <select
              name="prestamo"
              className="modal-input"
              value={nuevoPago.prestamo}
              onChange={handleChange}
            >
              <option value="">Seleccionar préstamo</option>
              {prestamos.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} - {p.empleado?.nombre || "Sin nombre"}
                </option>
              ))}
            </select>

            {/* Fecha del pago */}
            <input
              type="date"
              name="fecha_pago"
              value={nuevoPago.fecha_pago}
              onChange={handleChange}
              className="modal-input"
            />

            {/* Monto abonado */}
            <input
              type="number"
              name="monto_abono"
              placeholder="Monto"
              value={nuevoPago.monto_abono}
              onChange={handleChange}
              className="modal-input"
            />

            {/* Botones */}
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="cancel-btn">
                Cancelar
              </button>
              <button onClick={handleGuardarPago} className="save-btn">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
