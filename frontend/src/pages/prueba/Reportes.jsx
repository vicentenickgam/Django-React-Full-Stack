// /pages/prueba/Reportes.jsx
import React from "react";
import Menu from "./Menu";

export default function Reportes({ setPage }) {
  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <Menu setPage={setPage} />
      <h2 className="text-2xl font-bold mt-4">Reportes</h2>
      <div className="bg-white p-6 rounded shadow mt-4">
        <p>Filtros: Cliente, Estado, Fechas</p>
        <button className="bg-slate-800 text-white p-2 rounded mt-2">Generar PDF</button>
        <button className="bg-green-600 text-white p-2 rounded ml-2">Exportar Excel</button>
      </div>
    </div>
  );
}
