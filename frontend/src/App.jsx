// src/App.jsx
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// páginas Prueba
import PruebaLayout from "./pages/prueba/Layout";
import Dashboard from "./pages/prueba/Dashboard";
import Prestamos from "./pages/prueba/Prestamos";
import DetallePrestamo from "./pages/prueba/DetallePrestamo";
import NuevoPrestamo from "./pages/prueba/NuevoPrestamo";
import Empleados from "./pages/prueba/Empleados";
import NuevoEmpleado from "./pages/prueba/NuevoEmpleado";
import Pagos from "./pages/prueba/Pagos";
import NuevoPago from "./pages/prueba/NuevoPago";
import Reportes from "./pages/prueba/Reportes";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />

        {/* Rutas anidadas para /prueba */}
        <Route path="/prueba" element={<PruebaLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="detalle-prestamo" element={<DetallePrestamo />} />
          <Route path="nuevo-prestamo" element={<NuevoPrestamo />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="nuevo-empleado" element={<NuevoEmpleado />} />
          <Route path="pagos" element={<Pagos />} />
          <Route path="nuevo-pago" element={<NuevoPago />} />
          <Route path="reportes" element={<Reportes />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
