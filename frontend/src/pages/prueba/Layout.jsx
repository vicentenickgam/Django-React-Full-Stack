// src/pages/prueba/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";

export default function PruebaLayout() {
  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <Outlet />
    </div>
  );
}
