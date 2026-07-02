"use client";

import { useState } from "react";
import PanelControl from "@/components/editor/PanelControl";
import EscaletaTable from "@/components/editor/EscaletaTable";
import ControlesAvanzadosSidebar from "@/components/editor/ControlesAvanzadosSidebar";
import { calcularTiemposEscaleta } from "@/lib/timeEngine";
import { useEditorManager } from "@/hooks/useEditorManager";
import { useEditorContext } from "@/contextos/EditorContext";

interface EditorClientProps {
  initialEscaleta: any;
  initialBloques: any[];
}

export default function EditorClient({
  initialEscaleta,
  initialBloques,
}: EditorClientProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const { guardando } = useEditorContext();

  // Toda la complejidad del estado y base de datos delegada al Hook
  const {
    escaleta,
    setEscaleta,
    bloques,
    agregarBloque,
    actualizarBloque,
    eliminarBloque,
    // guardarCambios // Puedes pasarlo a un botón o manejarlo como requieras
  } = useEditorManager(initialEscaleta, initialBloques);

  const bloquesConTiempos = calcularTiemposEscaleta(
    escaleta?.hora_inicio_programa || "00:00",
    bloques,
  );

  return (
    <>
      <div className="flex-1 bg-background pb-20 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-6 mt-8">
          <PanelControl
            escaleta={escaleta}
            setEscaleta={setEscaleta}
            onOpenAdvancedControls={() => setIsAdvancedOpen(true)}
          />
          <EscaletaTable
            bloques={bloquesConTiempos}
            colorPrincipal={escaleta?.color_escaleta}
            mostrarResponsable={escaleta?.mostrar_col_responsable}
            mostrarRecursos={escaleta?.mostrar_col_recursos}
            mostrarComentarios={escaleta?.mostrar_col_comentarios}
            actualizarBloque={actualizarBloque}
            eliminarBloque={eliminarBloque}
            agregarBloque={agregarBloque}
          />
        </div>
      </div>

      <ControlesAvanzadosSidebar
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        avanzados={escaleta}
        setAvanzados={setEscaleta}
        onGuardarAvanzados={() => {}} // Conecta aquí tu guardarAvanzados del hook
        guardando={guardando}
      />
    </>
  );
}
