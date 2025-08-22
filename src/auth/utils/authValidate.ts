export const userCreateValidate = (formData: any) => {
  const errors: any = {};

  if (!formData.firstName || formData.firstName.trim().length < 3) {
    errors.firstName = "El nombre debe tener al menos 3 caracteres.";
  }

  if (!formData.email) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "El correo electrónico no es válido.";
  }

  if (!formData.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (formData.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres.";
  }

  return errors;
};
