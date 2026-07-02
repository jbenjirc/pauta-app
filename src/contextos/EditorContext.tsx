"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface EditorContextType {
  guardando: boolean;
  setGuardando: (val: boolean) => void;
  ultimaEdicion: string | null;
  setUltimaEdicion: (val: string | null) => void;
  // Función que la página le entregará al Navbar para que pueda ejecutarla
  ejecutarGuardado: (redirigir?: boolean) => Promise<void>;
  setEjecutarGuardado: (fn: (redirigir?: boolean) => Promise<void>) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [guardando, setGuardando] = useState(false);
  const [ultimaEdicion, setUltimaEdicion] = useState<string | null>(null);
  // Solo cambia esta línea en tu contexto:
  const [guardarFn, setGuardarFn] = useState<
    ((redirigir?: boolean) => Promise<void>) | null
  >(null);

  const ejecutarGuardado = async (redirigir = false) => {
    if (guardarFn) {
      await guardarFn(redirigir);
    }
  };

  return (
    <EditorContext.Provider
      value={{
        guardando,
        setGuardando,
        ultimaEdicion,
        setUltimaEdicion,
        ejecutarGuardado,
        setEjecutarGuardado: (fn) => setGuardarFn(() => fn),
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context)
    throw new Error("useEditorContext debe usarse dentro de EditorProvider");
  return context;
};
