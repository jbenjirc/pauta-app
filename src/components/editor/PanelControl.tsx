// components/editor/PanelControl.tsx
import { Settings2, Calendar, Clock } from "lucide-react";

interface PanelControlProps {
  escaleta: any;
  setEscaleta: (data: any) => void;
  onOpenAdvancedControls: () => void;
}

export default function PanelControl({
  escaleta,
  setEscaleta,
  onOpenAdvancedControls,
}: PanelControlProps) {
  const handleChange = (field: string, value: string) => {
    setEscaleta({ ...escaleta, [field]: value });
  };

  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border-line pb-6">
      <div className="flex-1 space-y-2">
        <input
          type="text"
          value={escaleta?.titulo_programa || ""}
          onChange={(e) => handleChange("titulo_programa", e.target.value)}
          placeholder="Nombre del Programa"
          className="w-full bg-transparent text-4xl font-bold text-text-main outline-none placeholder:opacity-30 focus:ring-2 focus:ring-primary/20 rounded-lg px-2 -ml-2"
        />
        <div className="flex flex-wrap items-center gap-4 text-text-muted">
          <input
            type="text"
            value={escaleta?.nombre_iglesia || ""}
            onChange={(e) => handleChange("nombre_iglesia", e.target.value)}
            placeholder="Nombre de la Iglesia"
            className="bg-transparent border-none outline-none focus:text-primary transition-colors"
          />
          <div className="flex items-center gap-2 border-l border-border-line pl-4">
            <Calendar className="w-4 h-4" />
            <input
              type="date"
              value={escaleta?.fecha_programa || ""}
              onChange={(e) => handleChange("fecha_programa", e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2 border-l border-border-line pl-4">
            <Clock className="w-4 h-4" />
            <input
              type="time"
              value={escaleta?.hora_inicio_programa || ""}
              onChange={(e) =>
                handleChange("hora_inicio_programa", e.target.value)
              }
              className="bg-transparent outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onOpenAdvancedControls}
        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-line text-text-main rounded-xl hover:bg-primary hover:text-primary-text transition-all active:scale-95 shadow-sm"
      >
        <Settings2 className="w-4 h-4" />
        <span>Avanzados</span>
      </button>
    </header>
  );
}
