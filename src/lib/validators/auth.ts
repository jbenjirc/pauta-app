// src/lib/validators/auth.ts
// Reglas de validación PURAS (sin React, sin Supabase). Testeable y reutilizable.
// Cada regla devuelve un resultado con estado y una clave i18n para el mensaje.

export type EstadoCampo = "vacio" | "invalido" | "valido";

export interface ResultadoValidacion {
  estado: EstadoCampo;
  /** Clave i18n del mensaje de error, o null si es válido/vacío. */
  errorKey: string | null;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(valor: string): ResultadoValidacion {
  if (valor.trim().length === 0) return { estado: "vacio", errorKey: null };
  if (!REGEX_EMAIL.test(valor))
    return { estado: "invalido", errorKey: "validacion.email.formato" };
  return { estado: "valido", errorKey: null };
}

/** Reglas de contraseña. Ajusta a lo que exijas en Supabase Auth. */
export const REGLAS_PASSWORD = {
  minLongitud: 8,
  requiereMayuscula: true,
  requiereNumero: true,
};

export function validarPassword(valor: string): ResultadoValidacion {
  if (valor.length === 0) return { estado: "vacio", errorKey: null };
  if (valor.length < REGLAS_PASSWORD.minLongitud)
    return { estado: "invalido", errorKey: "validacion.password.longitud" };
  if (REGLAS_PASSWORD.requiereMayuscula && !/[A-Z]/.test(valor))
    return { estado: "invalido", errorKey: "validacion.password.mayuscula" };
  if (REGLAS_PASSWORD.requiereNumero && !/[0-9]/.test(valor))
    return { estado: "invalido", errorKey: "validacion.password.numero" };
  return { estado: "valido", errorKey: null };
}

/** Un formulario es enviable sólo si todos los campos requeridos son válidos. */
export function formularioValido(...resultados: ResultadoValidacion[]) {
  return resultados.every((r) => r.estado === "valido");
}
