// /pages/prueba/index.jsx
import React, { useState } from "react";
import Menu from "./Menu";
import Login from "./Login";
import Prestamos from  "./Prestamos"
import DetallePrestamo from  "./DetallePrestamo"
import NuevoPrestamo from  "./NuevoPrestamo"
import Empleados from "./Empleados";
import NuevoEmpleado from "./NuevoEmpleado";
import Dashboard from "./Dashboard";
import Pagos from "./Pagos";
import NuevoPago from "./NuevoPago";
import Reportes from "./Reportes";

export default function PruebaApp() {
  const [page, setPage] = useState("login");

const pages = {
  login: <Login setPage={setPage} />,
  dashboard: <Dashboard setPage={setPage} />,
  prestamos: <Prestamos setPage={setPage} />,
  detallePrestamo: <DetallePrestamo setPage={setPage} />,
  nuevoPrestamo: <NuevoPrestamo setPage={setPage} />,
  empleados: <Empleados setPage={setPage} />,
  nuevoEmpleado: <NuevoEmpleado setPage={setPage} />,
  pagos: <Pagos setPage={setPage} />,
  nuevoPago: <NuevoPago setPage={setPage} />,
  reportes: <Reportes setPage={setPage} />,
};


  return pages[page] || <Login setPage={setPage} />;
}
