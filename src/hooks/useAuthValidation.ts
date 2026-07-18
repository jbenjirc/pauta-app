// src/hooks/useAuthValidation.ts
"use client";
// Estado de validación en tiempo real para el formulario de registro.
// La UI sólo lee `email`, `password`, sus estados, y `puedeEnviar`.
import { useMemo, useState } from "react";
import {
  validarEmail,
  validarPassword,
  formularioValido,
  type ResultadoValidacion,
} from "@/lib/validators/auth";

export function useAuthValidation() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // "touched" evita marcar en rojo antes de que el usuario escriba algo.
  const [tocado, setTocado] = useState({ email: false, password: false });

  const emailVal: ResultadoValidacion = useMemo(
    () => validarEmail(email),
    [email],
  );
  const passwordVal: ResultadoValidacion = useMemo(
    () => validarPassword(password),
    [password],
  );

  const puedeEnviar = formularioValido(emailVal, passwordVal);

  return {
    // valores
    email,
    password,
    setEmail,
    setPassword,
    // control de "tocado"
    tocado,
    marcarTocado: (campo: "email" | "password") =>
      setTocado((t) => ({ ...t, [campo]: true })),
    // resultados de validación (para pintar el borde rojo/verde)
    emailVal,
    passwordVal,
    puedeEnviar,
  };
}
