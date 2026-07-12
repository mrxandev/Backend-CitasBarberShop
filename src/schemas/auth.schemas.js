import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string({ required_error: "El nombre es obligatorio" }).min(1, "El nombre no puede estar vacío").trim(),
  lastName: z.string({ required_error: "El apellido es obligatorio" }).min(1, "El apellido no puede estar vacío").trim(),
  email: z.string({ required_error: "El correo es obligatorio" }).email("El correo no es válido").toLowerCase().trim(),
  phone: z.string({ required_error: "El teléfono es obligatorio" }).min(1, "El teléfono no puede estar vacío").trim(),
  password: z.string({ required_error: "La contraseña es obligatoria" }).min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string({ required_error: "El correo es obligatorio" }).email("El correo no es válido").toLowerCase().trim(),
  password: z.string({ required_error: "La contraseña es obligatoria" }).min(1, "La contraseña no puede estar vacía"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: "La contraseña actual es obligatoria" }).min(1),
  newPassword: z.string({ required_error: "La nueva contraseña es obligatoria" }).min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
});
