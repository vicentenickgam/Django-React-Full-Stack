import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "./Menu";
import "../../styles/prueba/Prestamos.css";

export default function DetallePrestamo() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID dinámico del préstamo

  const [prestamo, setPrestamo] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Cargar detalles del préstamo con sus pagos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/prestamos/${id}/`);
        if (!res.ok) throw new Error("Error al obtener el préstamo");
        const data = await res.json();

        setPrestamo(data);
        // Acceder a los pagos relacionados
        setPagos(data.pagos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return <div className="prestamos-container">Cargando detalles...</div>;
  if (error)
    return <div className="prestamos-container text-red-500">❌ {error}</div>;
  if (!prestamo)
    return <div className="prestamos-container">No se encontró el préstamo.</div>;

  return (
    <div className="prestamos-container">
      <Menu />

      <div className="prestamos-card">
        <h3 className="font-bold text-lg mb-4">Detalle del Préstamo</h3>

        <div className="detalle-info">
          <p>
            <strong>Empleado:</strong> {prestamo.empleado?.nombre || "Sin nombre"}
          </p>
          <p>
            <strong>Valor Solicitado:</strong>{" "}
            ${Number(prestamo.valor_solicitado).toLocaleString()}
          </p>
          <p>
            <strong>Número de Cuotas:</strong> {prestamo.numero_cuotas}
          </p>
          <p>
            <strong>Saldo Actual:</strong>{" "}
            ${Number(prestamo.saldo_actual).toLocaleString()}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span
              className={
                prestamo.estado === "Activo"
                  ? "text-green-600 font-semibold"
                  : "text-gray-500"
              }
            >
              {prestamo.estado}
            </span>
          </p>
        </div>

        <h3 className="font-bold text-lg mt-6">Historial de Pagos</h3>

        <table className="prestamos-table mt-2">
          <thead>
            <tr>
              <th>Fecha de Pago</th>
              <th>Monto Abonado</th>
              <th>Saldo Después del Pago</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length > 0 ? (
              pagos.map((pago, index) => (
                <tr key={index}>
                  <td>{pago.fecha_pago}</td>
                  <td>${Number(pago.monto_abono).toLocaleString()}</td>
                  <td>${Number(pago.saldo_despues_pago).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500">
                  No hay pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 text-right">
          <button
            className="btn-volver"
            onClick={() => navigate("/prueba/prestamos")}
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
