import { ToastContainer, toast, Bounce } from "react-toastify";
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
  const errores = [];

  if (typeof obj.sku !== "string" || obj.sku.length > 6) {
    errores.push(
      "El SKU debe ser un carácter numérico con una longitud máxima de 6 dígitos."
    );
  }

  if (typeof obj.articulo !== "string" || obj.articulo.length > 15) {
    errores.push(
      "El Artículo debe ser un carácter tipo texto con una longitud máxima de 15 dígitos."
    );
  }

  if (typeof obj.marca !== "string" || obj.marca.length > 15) {
    errores.push(
      "La Marca debe ser un carácter tipo texto con una longitud máxima de 15 dígitos."
    );
  }

  if (typeof obj.modelo !== "string" || obj.modelo.length > 20) {
    errores.push(
      "El Modelo debe ser un carácter tipo texto con una longitud máxima de 20 dígitos."
    );
  }

  if (
    typeof obj.departamento !== "number" ||
    obj.departamento.toString().length > 1
  ) {
    errores.push(
      "El Departamento debe ser un carácter numérico con una longitud de 1 dígito."
    );
  }

  if (typeof obj.clase !== "number" || obj.clase.toString().length > 2) {
    errores.push(
      "La Clase debe ser un carácter numérico con una longitud de 2 dígitos."
    );
  }

  if (typeof obj.familia !== "number" || obj.familia.toString().length > 3) {
    errores.push(
      "La Familia debe ser un carácter numérico con una longitud de 3 dígitos."
    );
  }

  if (typeof obj.stock !== "string" || obj.stock.length > 9) {
    errores.push(
      "El Stock debe ser un carácter numérico con una longitud máxima de 9 dígitos."
    );
  }

  if (typeof obj.cantidad !== "string" || obj.cantidad.length > 9) {
    errores.push(
      "La Cantidad debe ser un carácter numérico con una longitud máxima de 9 dígitos."
    );
  }

  if (
    typeof obj.descontinuado !== "number" ||
    obj.descontinuado.toString().length > 1
  ) {
    errores.push(
      "El Descontinuado debe ser un carácter numérico con una longitud máxima de 1 dígito."
    );
  }

  if (parseInt(obj.cantidad, 10) > parseInt(obj.stock, 10)) {
    errores.push("La Cantidad no puede ser mayor que el Stock.");
  }

  return errores.length > 0 ? errores : 1;
}

export function alert(msg: any, type: "error" | "success") {
  if (type === "error") {
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
  } else {
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
}
