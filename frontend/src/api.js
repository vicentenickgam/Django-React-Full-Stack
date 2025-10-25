import axios from "axios";

// URL base del backend Django (ajústala según tu entorno)
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Ejemplo de endpoints reutilizables
export const getEmpleados = () => api.get("empleados/");
export const getPrestamos = () => api.get("prestamos/");
export const getPagos = () => api.get("pagos/");
export const getPrestamoById = (id) => api.get(`prestamos/${id}/`);

export const createPago = (pago) => api.post("pagos/", pago);

export default api;
