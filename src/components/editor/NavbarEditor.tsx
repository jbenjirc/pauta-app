"use client";

import {
  ArrowLeft,
  Loader2,
  CloudUpload,
  CloudSync,
  Printer,
} from "lucide-react";
import { useState } from "react";
import ModalImprimir from "@/components/editor/modals/ModalImprimir";
import { useEditorContext } from "@/contextos/EditorContext";

export default function NavbarEditor() {
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Consumimos el puente de comunicación
  const { guardando, ejecutarGuardado, ultimaEdicion } = useEditorContext();

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
      <header className="bg-surface border-b border-line px-6 py-4 flex justify-between items-center shadow-sm shrink-0 z-40 transition-colors">
        <button
          onClick={() => ejecutarGuardado(true)}
          disabled={guardando}
          className="flex items-center gap-2 text-muted hover:text-main transition-colors disabled:opacity-50"
        >
          {guardando ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <ArrowLeft className="w-5 h-5" />
          )}
          <span className="font-medium hidden sm:inline">
            {guardando ? "Saliendo..." : "Volver"}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1">
            <CloudSync className="w-5 h-5 text-muted opacity-70" />
            <span className="text-muted text-sm italic opacity-80">
              Guardado hace {calcularTiempoTranscurrido(ultimaEdicion)}
            </span>
          </div>

          <button
            onClick={() => setIsPrintOpen(true)}
            className="flex items-center gap-2 bg-background border border-line hover:bg-border-line/20 text-main px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-muted" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            onClick={() => ejecutarGuardado(false)}
            disabled={guardando}
            className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-text px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-all shadow-sm"
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

      <ModalImprimir
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />
    </>
  );
}
