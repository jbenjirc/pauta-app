// components/editor/modals/ModalImprimir.tsx
"use client";

import {
  X,
  Printer,
  CheckSquare,
  Square,
  FileText,
  Settings2,
  Loader2,
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
    horizontal: false,
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

            {/* Selector de Formato (Segmented Control UI) */}
            <div className="flex bg-background p-1 border border-border-line rounded-xl">
              <button
                onClick={() => setOpciones({ ...opciones, formato: "LETTER" })}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  opciones.formato === "LETTER"
                    ? "bg-surface shadow-sm text-primary ring-1 ring-border-line"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                Carta
              </button>
              <button
                onClick={() => setOpciones({ ...opciones, formato: "A4" })}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  opciones.formato === "A4"
                    ? "bg-surface shadow-sm text-primary ring-1 ring-border-line"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                A4
              </button>
            </div>

            {/* Selector de Orientación Visual */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={() => setOpciones({ ...opciones, horizontal: false })}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                  !opciones.horizontal
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                    : "border-border-line text-text-muted hover:border-text-muted hover:bg-background"
                }`}
              >
                {/* Ícono CSS: Hoja Vertical */}
                <div className="w-8 h-10 border-2 border-current rounded-sm shadow-sm flex flex-col p-1.5 gap-1 justify-start">
                  <div className="w-full h-0.5 bg-current rounded-full opacity-60"></div>
                  <div className="w-3/4 h-0.5 bg-current rounded-full opacity-60"></div>
                  <div className="w-full h-0.5 bg-current rounded-full opacity-60"></div>
                </div>
                <span className="text-sm font-semibold">Vertical</span>
              </button>

              <button
                onClick={() => setOpciones({ ...opciones, horizontal: true })}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                  opciones.horizontal
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                    : "border-border-line text-text-muted hover:border-text-muted hover:bg-background"
                }`}
              >
                {/* Ícono CSS: Hoja Horizontal */}
                <div className="w-10 h-8 border-2 border-current rounded-sm shadow-sm flex flex-col p-1.5 gap-1 justify-start">
                  <div className="w-full h-0.5 bg-current rounded-full opacity-60"></div>
                  <div className="w-3/4 h-0.5 bg-current rounded-full opacity-60"></div>
                  <div className="w-full h-0.5 bg-current rounded-full opacity-60"></div>
                </div>
                <span className="text-sm font-semibold">Horizontal</span>
              </button>
            </div>
          </div>

          <hr className="border-border-line" />

          {/* Ajustes de Contenido */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wider">
              <Settings2 className="w-4 h-4" /> Opciones de Contenido
            </h3>

            <div className="flex flex-col gap-3">
              {/* Tarjeta Clickable: Logo */}
              <button
                onClick={() => toggleOpcion("incluirLogo")}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all border text-left ${
                  opciones.incluirLogo
                    ? "border-primary bg-primary/5 text-text-main"
                    : "border-border-line text-text-muted hover:border-text-main"
                }`}
              >
                {opciones.incluirLogo ? (
                  <CheckSquare className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-text-muted shrink-0" />
                )}
                <span className="text-sm font-medium">
                  Incluir logo de la iglesia
                </span>
              </button>

              {/* Tarjeta Clickable: Modo Simple */}
              <button
                onClick={() => toggleOpcion("modoSimple")}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all border text-left ${
                  opciones.modoSimple
                    ? "border-primary bg-primary/5 text-text-main"
                    : "border-border-line text-text-muted hover:border-text-main"
                }`}
              >
                {opciones.modoSimple ? (
                  <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-text-muted shrink-0 mt-0.5" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Modo Simple</span>
                  <span
                    className={`text-xs mt-1 ${opciones.modoSimple ? "text-text-main" : "text-text-muted"}`}
                  >
                    {opciones.modoSimple
                      ? "Oculta responsables, enlaces y comentarios de cabina."
                      : "Imprime todas las columnas configuradas en la mesa de control."}
                  </span>
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
