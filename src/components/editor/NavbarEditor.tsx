// components/editor/NavbarEditor.tsx
"use client";

import {
  PanelLeftOpen,
  PanelRightOpen,
  Loader2,
  CloudUpload,
  CloudSync,
  Printer,
  Moon,
} from "lucide-react";
import { useState } from "react";
import ModalImprimir from "@/components/editor/modals/ModalImprimir";
import { useEditorContext } from "@/contextos/EditorContext";

export default function NavbarEditor() {
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const { guardando, ejecutarGuardado, ultimaEdicion } = useEditorContext();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const calcularTiempoTranscurrido = (fechaString: string | null) => {
    if (!fechaString) return "N/A";
    const segundos = Math.floor(
      (new Date().getTime() - new Date(fechaString).getTime()) / 1000,
    );
    if (segundos < 60) return "unos segundos";
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `${horas} h`;
    return `${Math.floor(horas / 24)} d`;
  };

  return (
    <>
      <header className="bg-surface border-b border-border-line px-6 py-4 flex justify-between items-center shadow-sm shrink-0 z-40 transition-colors">
        <div>
          {/* <PanelLeftOpen className="w-5 h-5 text-text-muted opacity-70" /> */}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 mr-4">
            <CloudSync className="w-4 h-4 text-text-muted opacity-70" />
            <span className="text-text-muted text-xs italic opacity-80">
              Guardado hace {calcularTiempoTranscurrido(ultimaEdicion)}
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border border-border-line text-text-muted hover:text-primary transition-colors"
          >
            <Moon className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPrintOpen(true)}
            className="flex items-center gap-2 bg-bg-app border border-border-line hover:bg-border-line/20 text-text-main px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Printer className="w-4 h-4 text-text-muted" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            onClick={() => ejecutarGuardado(false)}
            disabled={guardando}
            className="flex items-center gap-2 bg-primary hover:brightness-110 text-primary-text px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-all shadow-sm"
          >
            {guardando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CloudUpload className="w-4 h-4" />
            )}
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      {isPrintOpen && (
        <ModalImprimir
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
        />
      )}
    </>
  );
}
