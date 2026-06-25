import { FileText } from "lucide-react";
import EscaletaCard from "./EscaletaCard";

interface Props {
  escaletas: any[];
  onCardClick: (escaleta: any) => void;
  onCrearClick: () => void;
}

export default function EscaletasGrid({
  escaletas,
  onCardClick,
  onCrearClick,
}: Props) {
  if (escaletas.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes escaletas aún
        </h3>
        <p className="text-gray-500 mb-6">
          Crea tu primer programa para empezar a organizar los tiempos en
          cabina.
        </p>
        <button
          onClick={onCrearClick}
          className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
        >
          Crear mi primera escaleta &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {escaletas.map((escaleta) => (
        <EscaletaCard
          key={escaleta.id}
          escaleta={escaleta}
          onClick={() => onCardClick(escaleta)}
        />
      ))}
    </div>
  );
}
