import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Menu from "./Menu";
import "../styles/prueba/Reportes.css";

export default function Reportes({ setPage }) {
  const [prestamos, setPrestamos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [filtroEmpresas, setFiltroEmpresas] = useState([]);
  const [prestamosFiltrados, setPrestamosFiltrados] = useState([]);

  const API_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [prestamosRes, empleadosRes] = await Promise.all([
          axios.get(`${API_URL}/prestamos/`),
          axios.get(`${API_URL}/empleados/`),
        ]);

        const prestamosConEmpresa = prestamosRes.data.map((p) => ({
          ...p,
          empresa: p.empleado?.empresa || "—",
          nombre: p.empleado?.nombre || "Desconocido",
          idEmpleado: p.empleado?.cedula || "",
        }));

        setPrestamos(prestamosConEmpresa);

        const listaEmpresas = [
          ...new Set(empleadosRes.data.map((e) => e.empresa)),
        ].filter(Boolean);
        setEmpresas(listaEmpresas);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (filtroEmpresas.length === 0) {
      setPrestamosFiltrados(prestamos);
    } else {
      const filtrados = prestamos.filter((p) =>
        filtroEmpresas.includes(p.empresa)
      );
      setPrestamosFiltrados(filtrados);
    }
  }, [filtroEmpresas, prestamos]);

  const handleEmpresaChange = (e) => {
    const opciones = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFiltroEmpresas(opciones);
  };

  const seleccionarTodas = () => {
    setFiltroEmpresas(empresas); 
  };



  // === EXPORTAR EXCEL (estilizado) ===
  const exportarExcel = () => {
    if (prestamosFiltrados.length === 0) return alert("No hay datos para exportar");

    const hojaDatos = [
      [
        "No.",
        "Nombre Trabajador",
        "ID",
        "Empresa",
        "Fecha Desembolso",
        "Valor Préstamo",
        "Total Cuotas",
        "Valor Cuota",
        "Pagadas",
        "Pendientes",
        "Saldo",
      ],
      ...prestamosFiltrados.map((p, index) => [
        index + 1,
        p.nombre,
        p.empleado?.cedula || "—",
        p.empresa,
        p.fecha_inicio || "—",
        p.valor_solicitado,
        p.numero_cuotas,
        p.valor_cuota,
        p.cuotas_pagadas || 0,
        p.numero_cuotas - (p.cuotas_pagadas || 0),
        p.saldo_actual,
      ]),
    ];

    const hoja = XLSX.utils.aoa_to_sheet(hojaDatos);

    // Estilo básico: ancho de columnas y formato moneda
    const range = XLSX.utils.decode_range(hoja["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const ancho = 18;
      hoja["!cols"] = hoja["!cols"] || [];
      hoja["!cols"][C] = { wch: ancho };
    }

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reporte de Préstamos");
    XLSX.writeFile(libro, "reporte_prestamos.xlsx");
  };


  return (
    <div className="reportes-container">
      <Menu setPage={setPage} />

      <div className="contenido-principal">
        <div className="card-reportes">
          {/* Título */}
          <div className="encabezado">
            <h2>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1484/1484521.png"
                alt="icon"
                className="icono-titulo"
              />
              Reportes de Préstamos
            </h2>
          </div>

          {/* Filtro */}
          <div className="filtro-empresa">
            <label>Filtrar por Empresa:</label>

            <div className="fila-filtros">
              <select
                multiple
                onChange={handleEmpresaChange}
                size={empresas.length > 5 ? 5 : empresas.length}
                value={filtroEmpresas}
              >
                {empresas.map((empresa) => (
                  <option key={empresa} value={empresa}>
                    {empresa}
                  </option>
                ))}
              </select>

              <button className="btn-seleccionar-todo" onClick={seleccionarTodas}>
                Seleccionar todo
              </button>
            </div>

            <p className="nota">Puedes seleccionar una o varias empresas (Ctrl + clic).</p>
          </div>


          {/* Tabla */}
          <div className="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nombre Trabajador</th>
                  <th>ID</th>
                  <th>Empresa</th>
                  <th>Fecha Desembolso</th>
                  <th>Valor Préstamo</th>
                  <th>Total Cuotas</th>
                  <th>Valor Cuota</th>
                  <th>Pagadas</th>
                  <th>Pendientes</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {prestamosFiltrados.map((p, index) => {
                  const cuotasPendientes =
                    p.numero_cuotas - (p.cuotas_pagadas || 0);
                  return (
                    <tr key={p.id}>
                      <td>{index + 1}</td>
                      <td>{p.nombre}</td>
                      <td>{p.empleado?.documento || "—"}</td>
                      <td>{p.empresa}</td>
                      <td>{p.fecha_inicio || "—"}</td>
                      <td>${parseFloat(p.valor_solicitado).toLocaleString()}</td>
                      <td>{p.numero_cuotas}</td>
                      <td>${parseFloat(p.valor_cuota).toLocaleString()}</td>
                      <td>{p.cuotas_pagadas || 0}</td>
                      <td>{cuotasPendientes}</td>
                      <td>${parseFloat(p.saldo_actual).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Botones */}
          <div className="botones">
            <button className="btn-amarillo" onClick={exportarExcel}>
              Exportar Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
