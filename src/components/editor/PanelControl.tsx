import { Building, Clock, Calendar, Palette } from "lucide-react";

type PanelGeneralProps = {
  escaleta: any;
  setEscaleta: (escaleta: any) => void;
  onOpenAdvancedControls?: () => void;
};

export default function PanelControl({
  escaleta,
  setEscaleta,
  onOpenAdvancedControls,
}: PanelGeneralProps) {
  // Evitamos renderizar si la escaleta aún no carga
  if (!escaleta) return null;

  return (
    <div className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-6 mb-8 transition-colors dark:bg-gray-800 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300 flex items-center gap-1">
            Título del Programa
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-medium"
            value={escaleta.titulo_programa || ""}
            onChange={(e) =>
              setEscaleta({ ...escaleta, titulo_programa: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 dark:text-gray-300">
            <Building className="w-4 h-4" /> Iglesia
          </label>
          <input
            type="text"
            placeholder="Ej. Narvarte"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            value={escaleta.nombre_iglesia || ""}
            onChange={(e) =>
              setEscaleta({ ...escaleta, nombre_iglesia: e.target.value })
            }
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 dark:text-gray-300">
              <Clock className="w-4 h-4" /> Inicio
            </label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={escaleta.hora_inicio_programa || ""}
              onChange={(e) =>
                setEscaleta({
                  ...escaleta,
                  hora_inicio_programa: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 dark:text-gray-300">
              <Calendar className="w-4 h-4" /> Fecha
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={escaleta.fecha_programa || ""}
              onChange={(e) =>
                setEscaleta({ ...escaleta, fecha_programa: e.target.value })
              }
            />
          </div>
          <div className="w-16">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 dark:text-gray-300">
              <Palette className="w-4 h-4" />
            </label>
            <input
              type="color"
              className="w-full h-[42px] p-1 border border-gray-300 rounded-lg cursor-pointer"
              value={escaleta.color_escaleta || "#EA580C"}
              onChange={(e) =>
                setEscaleta({ ...escaleta, color_escaleta: e.target.value })
              }
            />
          </div>
        </div>
      </div>
      <span
        className="text-sm text-gray-400 mt-3 block hover:text-gray-600 transition-colors cursor-pointer dark:hover:text-gray-300"
        onClick={onOpenAdvancedControls}
      >
        Configuración avanzada
      </span>
    </div>
  );
}
