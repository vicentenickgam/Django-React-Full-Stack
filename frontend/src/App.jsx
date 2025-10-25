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
import Empleados from "./pages/prueba/Empleados";
import Pagos from "./pages/prueba/Pagos";
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
          <Route path="detalle-prestamo/:id" element={<DetallePrestamo />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="pagos" element={<Pagos />} />
          <Route path="reportes" element={<Reportes />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
