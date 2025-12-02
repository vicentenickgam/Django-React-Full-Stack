import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import "../styles/prueba/Pagos.css";

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoPago, setNuevoPago] = useState({
    prestamo_id: "",
    fecha_pago: "",
    monto_abono: "",
  });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const API_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pagosRes, prestamosRes] = await Promise.all([
          fetch(`${API_URL}/pagos/`),
          fetch(`${API_URL}/prestamos/`),
        ]);
        if (!pagosRes.ok || !prestamosRes.ok)
          throw new Error("Error al cargar datos");

        const pagosData = await pagosRes.json();
        const prestamosData = await prestamosRes.json();

        setPagos(pagosData);
        setPrestamos(prestamosData);
      } catch (error) {
        console.error("❌ Error al cargar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "prestamo_id") {
      const prestamoSel = prestamos.find((p) => p.id === Number(value));
      setNuevoPago({
        ...nuevoPago,
        prestamo_id: value,
        monto_abono: prestamoSel ? prestamoSel.valor_cuota : "",
      });
    } else {
      setNuevoPago({ ...nuevoPago, [name]: value });
    }
  };

  const handleGuardarPago = async () => {
    const { prestamo_id, fecha_pago, monto_abono } = nuevoPago;

    if (!prestamo_id || !fecha_pago || !monto_abono) {
      setMensaje("⚠️ Todos los campos son obligatorios.");
      return;
    }

    const pagoData = {
      prestamo_id: Number(prestamo_id),
      fecha_pago,
      monto_abono: parseFloat(monto_abono),
    };

    try {
      const res = await fetch(`${API_URL}/pagos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pagoData),
      });

      if (!res.ok) throw new Error("Error al registrar el pago");

      const pagoGuardado = await res.json();
      setPagos([...pagos, pagoGuardado]);
      setMensaje("✅ Pago registrado correctamente.");

      setNuevoPago({ prestamo_id: "", fecha_pago: "", monto_abono: "" });
      setShowModal(false);

      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("❌ Error al guardar pago:", error);
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

        <table className="pagos-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Préstamo</th>
              <th>Fecha de Pago</th>
              <th>Monto Abonado</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length > 0 ? (
              pagos.map((pago) => (
                <tr key={pago.id}>
                  <td>{pago.prestamo?.empleado_nombre || pago.prestamo?.empleado?.nombre || "Desconocido"}</td>
                  <td>#{pago.prestamo?.id || pago.prestamo_id}</td>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-title">Registrar Pago</h3>
            <select
              name="prestamo_id"
              className="modal-input"
              value={nuevoPago.prestamo_id}
              onChange={handleChange}
            >
              <option value="">Seleccionar préstamo</option>
              {prestamos
                .filter((p) => p.estado !== "Pagado") // 🔹 Muestra solo los préstamos activos
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - {p.empleado?.nombre} (${p.valor_cuota}/cuota)
                  </option>
                ))}
            </select>
            <input
              type="date"
              name="fecha_pago"
              value={nuevoPago.fecha_pago}
              onChange={handleChange}
              className="modal-input"
            />

            <input
              type="number"
              name="monto_abono"
              placeholder="Monto abonado"
              value={nuevoPago.monto_abono}
              className="modal-input"
              readOnly
            />

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
