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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-2xl relative border border-line">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-main transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-main mb-6 pr-8 truncate">
          {escaleta.titulo_programa}
        </h2>

        <div className="space-y-4 text-muted mb-8 bg-background p-4 rounded-xl border border-line">
          {escaleta.fecha_programa && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted opacity-70" />
              <span>
                <strong className="font-medium text-main">Fecha:</strong>{" "}
                {new Date(escaleta.fecha_programa).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted opacity-70" />
            <span>
              <strong className="font-medium text-main">Inicio:</strong>{" "}
              {escaleta.hora_inicio_programa || "--:--"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-muted opacity-70" />
            <span className="flex items-center gap-2">
              <strong className="font-medium text-main">Color:</strong>{" "}
              <span
                className="w-4 h-4 rounded-full border border-line shadow-sm"
                style={{ backgroundColor: escaleta.color_escaleta }}
              ></span>
            </span>
          </div>
        </div>

        <div className="text-xs text-muted/70 text-center mb-4">
          Última edición: {new Date(escaleta.ultima_edicion).toLocaleString()}
        </div>

        <Link
          href={`/editor/${escaleta.slug || escaleta.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-text py-3 rounded-xl font-medium hover:opacity-90 transition-all shadow-sm"
        >
          <Edit className="w-4 h-4" /> Entrar al Editor
        </Link>
      </div>
    </div>
  );
}
