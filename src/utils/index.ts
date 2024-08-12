import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to convert ISO date string to YYYY-MM-DD
export const formatDateForInput = (isoDate: string | null) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

// Validate the object in the form
export function validate(obj: any) {
  const errores = new Set();

  if (
    typeof obj.sku !== "string" ||
    obj.sku.length > 6 ||
    !/^\d+$/.test(obj.sku)
  ) {
    errores.add(
      "El SKU debe ser un carácter numérico con una longitud máxima de 6 dígitos y solo puede contener números."
    );
  }

  if (typeof obj.articulo !== "string" || obj.articulo.length > 15) {
    errores.add(
      "El Artículo debe ser un carácter tipo texto con una longitud máxima de 15 dígitos."
    );
  }

  if (typeof obj.marca !== "string" || obj.marca.length > 15) {
    errores.add(
      "La Marca debe ser un carácter tipo texto con una longitud máxima de 15 dígitos."
    );
  }

  if (typeof obj.modelo !== "string" || obj.modelo.length > 20) {
    errores.add(
      "El Modelo debe ser un carácter tipo texto con una longitud máxima de 20 dígitos."
    );
  }

  if (
    typeof obj.departamento !== "number" ||
    obj.departamento.toString().length > 1
  ) {
    errores.add(
      "El Departamento debe ser un carácter numérico con una longitud de 1 dígito."
    );
  }

  if (typeof obj.clase !== "number" || obj.clase.toString().length > 2) {
    errores.add(
      "La Clase debe ser un carácter numérico con una longitud de 2 dígitos."
    );
  }

  // Validar stock
  if (obj.stock !== null && obj.stock !== "") {
    const stockStr = String(obj.stock).trim();
    if (!/^\d{1,9}$/.test(stockStr)) {
      errores.add(
        "El Stock debe ser un carácter numérico con una longitud máxima de 9 dígitos y solo puede contener números."
      );
    }
  }

  // Validar cantidad
  if (obj.cantidad !== null && obj.cantidad !== "") {
    const cantidadStr = String(obj.cantidad).trim();
    if (!/^\d{1,9}$/.test(cantidadStr)) {
      errores.add(
        "La Cantidad debe ser un carácter numérico con una longitud máxima de 9 dígitos y solo puede contener números."
      );
    }
  }

  // Validar descontinuado
  if (obj.descontinuado !== null && obj.descontinuado !== "") {
    const descontinuadoStr = String(obj.descontinuado).trim();
    if (!/^\d{1,9}$/.test(descontinuadoStr)) {
      errores.add(
        "El Descontinuado debe ser un carácter numérico con una longitud máxima de 9 dígitos y solo puede contener números."
      );
    }
  }

  if (
    obj.stock !== null &&
    obj.cantidad !== null &&
    parseInt(obj.cantidad, 10) > parseInt(obj.stock, 10)
  ) {
    errores.add("La Cantidad no puede ser mayor que el Stock.");
  }

  return errores.size > 0 ? Array.from(errores) : 1;
}

export function alert(msg: any, type: "error" | "success") {
  toast[type](msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
}
