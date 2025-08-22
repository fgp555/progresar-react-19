import { baseUrl, iconUserUrl } from "@/config/constants";

// Validar y obtener la imagen del operador o usuario
export const validateImgPath = (image: string | undefined, imgDefault = iconUserUrl) => {
  if (!image) {
    return imgDefault; // Imagen por defecto
  }
  if (image.startsWith("http") || image.startsWith("https")) {
    return image; // La ruta ya es absoluta
  }
  return `${baseUrl}/uploads/${image}`;
};
