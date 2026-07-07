// components/editor/modals/ModalImprimir.tsx
"use client";

import {
  X,
  Printer,
  FileText,
  Settings2,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import EscaletaPDF from "@/components/editor/EscaletaPDF";
import { useEditorContext } from "@/contextos/EditorContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalImprimir({ isOpen, onClose }: Props) {
  const { datosImpresion } = useEditorContext();
  const [generando, setGenerando] = useState(false);
  const [opciones, setOpciones] = useState({
    formato: "LETTER",
    horizontal: false, // Predeterminado: vertical
    incluirLogo: false,
    modoSimple: true,
  });

  if (!isOpen) return null;

  const escaleta = datosImpresion?.escaleta || {};
  const bloques = datosImpresion?.bloques || [];

  const toggleOpcion = (key: keyof typeof opciones) => {
    if (typeof opciones[key] === "boolean") {
      setOpciones((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleGenerarPDF = async () => {
    setGenerando(true);
    try {
      const blob = await pdf(
        <EscaletaPDF
          escaleta={escaleta}
          bloques={bloques}
          opciones={opciones}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      onClose();
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-text-main/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border-line flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-line flex justify-between items-center bg-background">
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            Configurar Impresión
          </h2>
          <button
            onClick={onClose}
            disabled={generando}
            className="text-text-muted hover:text-text-main transition-colors disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Opciones */}
        <div className="p-6 flex flex-col gap-8">
          {/* Ajustes de Hoja */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wider">
              <FileText className="w-4 h-4" /> Configuración de Hoja
            </h3>

            {/* Droplist Semántico de Formato */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="formato-hoja"
                className="text-sm font-medium text-text-muted px-1"
              >
                Tamaño del papel
              </label>
              <div className="relative">
                <select
                  id="formato-hoja"
                  value={opciones.formato}
                  onChange={(e) =>
                    setOpciones({ ...opciones, formato: e.target.value })
                  }
                  className="w-full appearance-none bg-background border border-border-line text-text-main rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer shadow-sm hover:border-text-muted"
                >
                  <option value="LETTER">Carta (Letter)</option>
                  <option value="A4">A4</option>
                </select>
                <ChevronDown className="w-4 h-4 text-text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Orientación Inline con Íconos */}
            <div className="flex items-center justify-between bg-background border border-border-line p-2 rounded-xl mt-1 shadow-sm">
              <span className="text-sm font-medium text-text-main px-2">
                Orientación:
              </span>
              <div className="flex gap-1 p-1 bg-surface rounded-lg border border-border-line">
                {/* Ícono Vertical (Predeterminado) */}
                <button
                  onClick={() =>
                    setOpciones({ ...opciones, horizontal: false })
                  }
                  className={`p-2 rounded-md transition-all flex items-center justify-center ${
                    !opciones.horizontal
                      ? "bg-primary text-primary-text shadow-sm"
                      : "text-text-muted hover:bg-background hover:text-text-main"
                  }`}
                  aria-label="Orientación Vertical"
                  title="Vertical"
                >
                  <div className="w-4 h-5 border-[2px] border-current rounded-[3px] opacity-90" />
                </button>

                {/* Ícono Horizontal */}
                <button
                  onClick={() => setOpciones({ ...opciones, horizontal: true })}
                  className={`p-2 rounded-md transition-all flex items-center justify-center ${
                    opciones.horizontal
                      ? "bg-primary text-primary-text shadow-sm"
                      : "text-text-muted hover:bg-background hover:text-text-main"
                  }`}
                  aria-label="Orientación Horizontal"
                  title="Horizontal"
                >
                  <div className="w-5 h-4 border-[2px] border-current rounded-[3px] opacity-90" />
                </button>
              </div>
            </div>
          </div>

          <hr className="border-border-line" />

          {/* Ajustes de Contenido */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wider">
              <Settings2 className="w-4 h-4" /> Opciones de Contenido
            </h3>

            <div className="flex flex-col gap-3">
              {/* Tarjeta con Toggle: Logo */}
              <button
                onClick={() => toggleOpcion("incluirLogo")}
                className="flex items-center justify-between p-3.5 rounded-xl transition-all border border-border-line bg-background hover:border-text-muted text-left group"
              >
                <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">
                  Incluir logo de la iglesia
                </span>
                {/* Switch UI */}
                <div
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${opciones.incluirLogo ? "bg-primary" : "bg-border-line"}`}
                >
                  <div
                    className={`w-4 h-4 bg-surface rounded-full shadow-sm transition-transform ${opciones.incluirLogo ? "translate-x-5" : "translate-x-0"}`}
                  />
                </div>
              </button>

              {/* Tarjeta con Toggle: Modo Simple */}
              <button
                onClick={() => toggleOpcion("modoSimple")}
                className="flex items-center justify-between p-3.5 rounded-xl transition-all border border-border-line bg-background hover:border-text-muted text-left group"
              >
                <div className="flex flex-col pr-4">
                  <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">
                    Modo Simple
                  </span>
                  <span className="text-xs mt-1 text-text-muted">
                    {opciones.modoSimple
                      ? "Oculta responsables, enlaces y comentarios."
                      : "Imprime todas las columnas configuradas."}
                  </span>
                </div>
                {/* Switch UI */}
                <div
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${opciones.modoSimple ? "bg-primary" : "bg-border-line"}`}
                >
                  <div
                    className={`w-4 h-4 bg-surface rounded-full shadow-sm transition-transform ${opciones.modoSimple ? "translate-x-5" : "translate-x-0"}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-line bg-background flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={generando}
            className="px-5 py-2.5 text-text-main font-medium hover:bg-surface border border-transparent hover:border-border-line rounded-xl transition-all text-sm disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerarPDF}
            disabled={generando}
            className="px-6 py-2.5 bg-primary hover:brightness-110 text-primary-text font-bold rounded-xl shadow-sm flex items-center gap-2 text-sm transition-all disabled:opacity-50"
          >
            {generando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                Generar PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
