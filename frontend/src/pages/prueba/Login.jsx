// /pages/prueba/Login.jsx
import React from "react";

export default function Login({ setPage }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Sistema de Préstamos</h2>
        <input placeholder="Usuario" className="border w-full p-2 mb-2 rounded" />
        <input placeholder="Contraseña" type="password" className="border w-full p-2 mb-2 rounded" />
        <button onClick={() => setPage("dashboard")} className="bg-blue-600 text-white w-full p-2 rounded">Ingresar</button>
      </div>
    </div>
  );
}
