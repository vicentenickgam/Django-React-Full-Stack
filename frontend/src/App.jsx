// src/App.jsx
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Login
import Login from "./pages/Login";

// Protección de rutas
import ProtectedRoute from "./components/ProtectedRoute";

// Layout principal de prueba
import PruebaLayout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Prestamos from "./pages/Prestamos";
import DetallePrestamo from "./pages/DetallePrestamo";
import Empleados from "./pages/Empleados";
import Pagos from "./pages/Pagos";
import Reportes from "./pages/Reportes";

const NotFound = () => <h1>Página no encontrada</h1>;

function Logout() {
  localStorage.removeItem("loggedIn");
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />

        {/* RUTAS PROTEGIDAS */}
<Route
  path="/"
  element={
    <ProtectedRoute>
      <PruebaLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="dashboard" />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="prestamos" element={<Prestamos />} />
  <Route path="detalle-prestamo/:id" element={<DetallePrestamo />} />
  <Route path="empleados" element={<Empleados />} />
  <Route path="pagos" element={<Pagos />} />
  <Route path="reportes" element={<Reportes />} />
</Route>


        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
