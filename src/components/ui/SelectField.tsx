// src/components/ui/SelectField.tsx
"use client";
// Dropdown presentacional. Se deshabilita hasta que el nivel padre esté
// seleccionado (habilitación progresiva) y muestra estado de carga.
import { cn } from "@/lib/utils/cn";

export interface OpcionSelect {
  id: string;
  nombre: string;
}

interface Props {
  label: string;
  value: string | null;
  opciones: OpcionSelect[];
  onChange: (id: string) => void;
  placeholder: string;
  disabled?: boolean;
  cargando?: boolean;
}

export default function SelectField({
  label,
  value,
  opciones,
  onChange,
  placeholder,
  disabled = false,
  cargando = false,
}: Props) {
  return (
    <div>
      <label
        className={cn(
          "block text-sm font-medium mb-1 transition-colors",
          disabled ? "text-muted/50" : "text-main",
        )}
      >
        {label}
      </label>
      <select
        value={value ?? ""}
        disabled={disabled || cargando}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-2 rounded-lg border bg-background text-main",
          "border-line outline-none transition-all",
          "focus:ring-2 focus:ring-primary focus:border-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        <option value="" disabled>
          {cargando ? "…" : placeholder}
        </option>
        {opciones.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
