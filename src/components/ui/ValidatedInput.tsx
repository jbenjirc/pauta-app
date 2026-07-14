// src/components/ui/ValidatedInput.tsx
"use client";
// Input presentacional con anillo de validación (rojo/verde).
// No sabe NADA de reglas: sólo recibe `estado` y pinta. Reutilizable en
// cualquier formulario (registro, edición de perfil, etc.).
import { cn } from "@/lib/utils/cn";
import type { EstadoCampo } from "@/lib/validators/auth";

interface Props {
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  /** Estado visual: define el color del borde. */
  estado?: EstadoCampo;
  /** Mensaje bajo el campo (ya traducido). */
  mensaje?: string | null;
  autoComplete?: string;
}

export default function ValidatedInput({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  estado = "vacio",
  mensaje,
  autoComplete,
}: Props) {
  const bordePorEstado: Record<EstadoCampo, string> = {
    vacio: "border-line focus:ring-primary focus:border-primary",
    invalido: "border-danger focus:ring-danger focus:border-danger",
    valido: "border-success focus:ring-success focus:border-success",
  };

  return (
    <div>
      <label className="block text-sm font-medium text-main mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={estado === "invalido"}
        className={cn(
          "w-full px-4 py-2 bg-background text-main placeholder:text-muted",
          "rounded-lg border outline-none transition-all focus:ring-2",
          bordePorEstado[estado],
        )}
      />
      {estado === "invalido" && mensaje && (
        <p className="mt-1 text-xs text-danger">{mensaje}</p>
      )}
    </div>
  );
}
