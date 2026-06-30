import { Star } from "lucide-react";

interface Props {
  escaleta: any;
  onClick: () => void;
}

export default function EscaletaCard({ escaleta, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-surface border border-line rounded-xl p-6 hover:shadow-md hover:border-primary transition-all cursor-pointer group flex flex-col h-full relative"
    >
      {/* Botón de Favorito (Estrella) */}
      <button
        className="absolute top-4 right-4 text-muted hover:text-yellow-500 transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation(); // Evita que se abra la modal al marcar favorito
          // Aquí iría tu lógica para actualizar Supabase en el futuro
        }}
      >
        <Star
          className="w-5 h-5 transition-colors"
          fill={escaleta.favorito ? "#EAB308" : "none"}
          color={escaleta.favorito ? "#EAB308" : "currentColor"}
        />
      </button>

      <div className="flex items-center gap-3 mb-3 pr-8">
        <div
          className="w-4 h-4 rounded-full shadow-inner shrink-0 border border-line"
          style={{ backgroundColor: escaleta.color_escaleta || "#457b9d" }}
        ></div>
        <h3 className="text-lg font-bold text-main group-hover:opacity-80 transition-opacity truncate">
          {escaleta.titulo_programa}
        </h3>
      </div>

      <div className="mt-auto pt-4 border-t border-line flex justify-between items-center text-xs text-muted">
        <span>
          Editado: {new Date(escaleta.ultima_edicion).toLocaleDateString()}
        </span>
        <span
          className={`px-2 py-1 rounded font-medium capitalize border ${
            escaleta.estado === "activa"
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-surface text-muted border-line"
          }`}
        >
          {escaleta.estado || "activa"}
        </span>
      </div>
    </div>
  );
}
