import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import "../../styles/prueba/Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard({ setPage }) {
  const [prestamos, setPrestamos] = useState([]);
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/prestamos/")
      .then((res) => res.json())
      .then(setPrestamos)
      .catch((err) => console.error("Error cargando préstamos:", err));

    fetch("http://127.0.0.1:8000/api/pagos/")
      .then((res) => res.json())
      .then(setPagos)
      .catch((err) => console.error("Error cargando pagos:", err));
  }, []);

  // --- Cálculos ---
  const totalPrestado = prestamos.reduce(
    (acc, p) => acc + parseFloat(p.valor_solicitado || 0),
    0
  );

  const totalAbonado = pagos.reduce(
    (acc, p) => acc + parseFloat(p.monto_abono || 0),
    0
  );

  // Cuotas pendientes: solo préstamos con saldo_actual > 0
  const cuotasPendientes = prestamos.filter((p) => p.saldo_actual > 0).length;

  const ultimosPrestamos = prestamos
    .slice(-3)
    .reverse()
    .map((p) => ({
      id: p.id,
      empleado: p.empleado?.nombre || "Sin empleado",
      valor: p.valor_solicitado,
      cuotas: p.numero_cuotas,
      saldo: p.saldo_actual,
    }));

  // --- Datos para los gráficos ---
  // Gráfico 1: préstamos agrupados por mes (por fecha_inicio)
  const prestamosPorMes = Object.values(
    prestamos.reduce((acc, p) => {
      const fecha = new Date(p.fecha_inicio);
      if (!isNaN(fecha)) {
        const mes = fecha.toLocaleString("default", { month: "short" });
        acc[mes] = acc[mes] || { mes, total: 0 };
        acc[mes].total += parseFloat(p.valor_solicitado || 0);
      }
      return acc;
    }, {})
  );

  // Gráfico 2: distribución de préstamos por empleado
  const distribucionEmpleados = Object.values(
    prestamos.reduce((acc, p) => {
      const nombre = p.empleado?.nombre || "Desconocido";
      acc[nombre] = acc[nombre] || { nombre, total: 0 };
      acc[nombre].total += parseFloat(p.valor_solicitado || 0);
      return acc;
    }, {})
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A0522D"];

  return (
    <div className="dashboard-container">
      <Menu setPage={setPage} />
      <h2 className="text-2xl font-bold mt-4">Dashboard</h2>

      {/* Tarjetas resumen */}
      <div className="cards">
        <div className="card card-blue">
          <p>Total Prestado</p>
          <h3>${totalPrestado.toLocaleString()}</h3>
        </div>
        <div className="card card-green">
          <p>Total Abonado</p>
          <h3>${totalAbonado.toLocaleString()}</h3>
        </div>
        <div className="card card-yellow">
          <p>Préstamos Pendientes</p>
          <h3>{cuotasPendientes}</h3>
        </div>
      </div>

      {/* Gráficos */}
      <div className="graphs">
        {/* Gráfico de préstamos por mes */}
        <div className="graph-box">
          <h3>Préstamos por mes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={prestamosPorMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por empleado */}
        <div className="distribution-box">
          <h3>Distribución por empleado</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distribucionEmpleados}
                dataKey="total"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {distribucionEmpleados.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Últimos préstamos */}
      <div className="last-loans">
        <h3 className="font-bold mb-2">Últimos Préstamos</h3>
        <ul>
          {ultimosPrestamos.length > 0 ? (
            ultimosPrestamos.map((p) => (
              <li key={p.id}>
                {p.id}. {p.empleado} — ${p.valor.toLocaleString()} —{" "}
                {p.cuotas} cuotas — saldo ${p.saldo.toLocaleString()}
              </li>
            ))
          ) : (
            <li>No hay préstamos registrados</li>
          )}
        </ul>
      </div>
    </div>
  );
}
