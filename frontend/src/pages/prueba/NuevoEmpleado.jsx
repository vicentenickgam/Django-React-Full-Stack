// /pages/prueba/Pagos.jsx
import React from "react";

export default function NuevoEmpleado({ setPage }) {
  return (
<div className="p-6 bg-slate-100 min-h-screen">
<Menu />
<h2 className="text-2xl font-bold mt-4">Nuevo Empleado</h2>
<div className="bg-white p-6 rounded shadow mt-4 w-1/2">
<input placeholder="Nombre" className="border w-full p-2 mb-2 rounded" />
<input placeholder="Documento" className="border w-full p-2 mb-2 rounded" />
<input placeholder="Cargo" className="border w-full p-2 mb-2 rounded" />
<button className="bg-green-600 text-white w-full p-2 rounded">Guardar</button>
</div>
</div>
  );
}
