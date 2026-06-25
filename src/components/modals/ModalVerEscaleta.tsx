"use client";
import { X, Calendar, Clock, Palette, Edit } from "lucide-react";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  escaleta: any;
}

export default function ModalVerEscaleta({ isOpen, onClose, escaleta }: Props) {
  if (!isOpen || !escaleta) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6 pr-8">
          {escaleta.titulo_programa}
        </h2>

        <div className="space-y-4 text-gray-600 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
          {escaleta.fecha_programa && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>
                <strong className="font-medium text-gray-800">Fecha:</strong>{" "}
                {new Date(escaleta.fecha_programa).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span>
              <strong className="font-medium text-gray-800">Inicio:</strong>{" "}
              {escaleta.hora_inicio_programa || "--:--"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-gray-400" />
            <span className="flex items-center gap-2">
              <strong className="font-medium text-gray-800">Color:</strong>{" "}
              <span
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: escaleta.color_escaleta }}
              ></span>
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center mb-4">
          Última edición: {new Date(escaleta.ultima_edicion).toLocaleString()}
        </div>

        <Link
          href={`/editor/${escaleta.slug || escaleta.id}`}
          className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors shadow-sm"
        >
          <Edit className="w-4 h-4" /> Entrar al Editor
        </Link>
      </div>
    </div>
  );
}
