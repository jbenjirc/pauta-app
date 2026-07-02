"use client";

import { X, Printer, CheckSquare, Square, Settings2 } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalImprimir({ isOpen, onClose }: Props) {
  const [opciones, setOpciones] = useState({
    responsables: true,
    recursos: false,
    comentarios: false,
    formato: "carta",
  });

  if (!isOpen) return null;

  const toggleOpcion = (key: keyof typeof opciones) => {
    if (key !== "formato") {
      setOpciones({ ...opciones, [key]: !opciones[key] });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-line flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line flex justify-between items-center bg-background/50">
          <h2 className="text-lg font-bold text-main flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            Opciones de impresión
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-main transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Opciones */}
        <div className="p-6 bg-surface flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-main flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-muted" /> Columnas a incluir
            </h3>

            <div className="flex flex-col gap-2">
              {[
                { key: "responsables", label: "Columna de Responsables" },
                { key: "recursos", label: "Columna de Recursos (Links)" },
                { key: "comentarios", label: "Columna de Comentarios/Notas" },
              ].map((opc) => (
                <button
                  key={opc.key}
                  onClick={() => toggleOpcion(opc.key as keyof typeof opciones)}
                  className="flex items-center gap-3 text-sm text-main hover:bg-background p-2 rounded-lg transition-colors border border-transparent hover:border-line text-left"
                >
                  {opciones[opc.key as keyof typeof opciones] ? (
                    <CheckSquare className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-muted shrink-0" />
                  )}
                  {opc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-4">
            <h3 className="text-sm font-semibold text-main">Formato de hoja</h3>
            <select
              value={opciones.formato}
              onChange={(e) =>
                setOpciones({ ...opciones, formato: e.target.value })
              }
              className="w-full bg-background border border-line text-main rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            >
              <option value="carta">Carta (Letter)</option>
              <option value="a4">A4</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-background flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-main font-medium hover:bg-border-line/30 rounded-lg transition-colors text-sm"
          >
            Cancelar
          </button>
          <button className="px-6 py-2 bg-primary hover:opacity-90 text-primary-text font-medium rounded-lg shadow-sm flex items-center gap-2 text-sm transition-all">
            <Printer className="w-4 h-4" />
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
