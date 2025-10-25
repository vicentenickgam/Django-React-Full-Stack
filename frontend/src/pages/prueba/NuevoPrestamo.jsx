// /pages/prueba/Menu.jsx
import React from "react";

export default function NuevoPrestamo({ setPage }) {
  return (
<div className="p-6 bg-slate-100 min-h-screen">
<Menu />
<h2 className="text-2xl font-bold mt-4">Nuevo Préstamo</h2>
<div className="bg-white p-6 rounded shadow mt-4 w-1/2">
<input placeholder="Cliente" className="border w-full p-2 mb-2 rounded" />
<input placeholder="Valor" className="border w-full p-2 mb-2 rounded" />
<input placeholder="Número de Cuotas" className="border w-full p-2 mb-2 rounded" />
<button className="bg-blue-600 text-white w-full p-2 rounded">Guardar</button>
</div>
</div>
  );
}
