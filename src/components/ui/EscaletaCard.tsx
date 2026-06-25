import { Clock, Star } from "lucide-react";

interface Props {
  escaleta: any;
  onClick: () => void;
}

export default function EscaletaCard({ escaleta, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group flex flex-col h-full relative"
    >
      {/* Botón de Favorito (Estrella) */}
      <button className="absolute top-4 right-4 text-gray-300 hover:text-yellow-400 transition-colors z-10">
        <Star
          className="w-5 h-5"
          fill={escaleta.favorito ? "currentColor" : "none"}
          color={escaleta.favorito ? "#EAB308" : "currentColor"}
        />
      </button>

      <div className="flex items-center gap-3 mb-3 pr-8">
        <div
          className="w-4 h-4 rounded-full shadow-inner shrink-0"
          style={{ backgroundColor: escaleta.color_escaleta || "#EA580C" }}
        ></div>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors truncate">
          {escaleta.titulo_programa}
        </h3>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <span>
          Editado: {new Date(escaleta.ultima_edicion).toLocaleDateString()}
        </span>
        <span
          className={`px-2 py-1 rounded font-medium capitalize ${
            escaleta.estado === "activa"
              ? "bg-green-50 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {escaleta.estado || "activa"}
        </span>
      </div>
    </div>
  );
}
