import { FileText } from "lucide-react";
import EscaletaCard from "./EscaletaCard"; // Asumiendo que también está adaptado

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
      <div className="bg-surface border border-dashed border-line rounded-2xl p-12 text-center transition-colors">
        <FileText className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-main mb-2">
          No tienes escaletas aún
        </h3>
        <p className="text-muted mb-6">
          Crea tu primer programa para empezar a organizar los tiempos en
          cabina.
        </p>
        <button
          onClick={onCrearClick}
          className="text-primary font-medium hover:opacity-80 transition-opacity"
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
