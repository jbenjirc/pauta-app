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
      // 1. Generamos el Blob del PDF en memoria
      const blob = await pdf(
        <EscaletaPDF
          escaleta={escaleta}
          bloques={bloques}
          opciones={opciones}
        />,
      ).toBlob();

      // 2. Creamos una URL temporal para el Blob
      const url = URL.createObjectURL(blob);

      // 3. Abrimos la URL en una nueva pestaña (el visor nativo del navegador)
      window.open(url, "_blank");

      onClose(); // Cerramos el modal tras generar
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-oxford-navy/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
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
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Opciones */}
        <div className="p-6 flex flex-col gap-6">
          {/* Ajustes de Hoja */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-main flex items-center gap-2 uppercase tracking-wide text-primary">
              <FileText className="w-4 h-4" /> Formato de Hoja
            </h3>

            <select
              value={opciones.formato}
              onChange={(e) =>
                setOpciones({ ...opciones, formato: e.target.value })
              }
              className="w-full bg-background border border-border-line text-text-main rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
            >
              <option value="LETTER">Carta (Letter)</option>
              <option value="A4">A4</option>
            </select>

            <button
              onClick={() => toggleOpcion("horizontal")}
              className="flex items-center justify-between p-3 border border-border-line rounded-xl hover:border-primary transition-colors mt-2"
            >
              <span className="text-sm text-text-main font-medium">
                Orientación Horizontal
              </span>
              <div
                className={`w-10 h-6 rounded-full p-1 transition-colors ${opciones.horizontal ? "bg-primary" : "bg-border-line"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-surface transition-transform ${opciones.horizontal ? "translate-x-4" : "translate-x-0"}`}
                />
              </div>
            </button>
          </div>

          <hr className="border-border-line" />

          {/* Ajustes de Contenido */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-main flex items-center gap-2 uppercase tracking-wide text-primary">
              <Settings2 className="w-4 h-4" /> Contenido
            </h3>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => toggleOpcion("incluirLogo")}
                className="flex items-center gap-3 text-sm text-text-main hover:bg-background p-2.5 rounded-xl transition-colors border border-transparent hover:border-border-line text-left"
              >
                {opciones.incluirLogo ? (
                  <CheckSquare className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-text-muted shrink-0" />
                )}
                Incluir logo de la iglesia
              </button>

              <button
                onClick={() => toggleOpcion("modoSimple")}
                className="flex items-start gap-3 text-sm text-text-main hover:bg-background p-2.5 rounded-xl transition-colors border border-transparent hover:border-border-line text-left"
              >
                {opciones.modoSimple ? (
                  <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-text-muted shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-medium block">Modo Simple</span>
                  <span className="text-xs text-text-muted">
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
            className="px-5 py-2.5 text-text-main font-medium hover:bg-border-line/30 rounded-xl transition-colors text-sm disabled:opacity-50"
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
                Abrir PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
