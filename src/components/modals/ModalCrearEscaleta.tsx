"use client";

import { X, Clock, Palette, Calendar, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  creando: boolean;
  formData: any;
  setFormData: (data: any) => void;
}

export default function ModalCrearEscaleta({
  isOpen,
  onClose,
  onSubmit,
  creando,
  formData,
  setFormData,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-line">
        <div className="px-6 py-4 border-b border-line flex justify-between items-center bg-background/50">
          <h2 className="text-lg font-bold text-main">Configurar Escaleta</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-main transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-main mb-1">
              Nombre del Programa
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Escuela sabática"
              className="w-full px-4 py-2 bg-background border border-line text-main placeholder:text-muted/70 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-main mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-muted" /> Fecha
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 bg-background border border-line text-main rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData({ ...formData, fecha: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-main mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted" /> Hora
              </label>
              <input
                type="time"
                required
                className="w-full px-4 py-2 bg-background border border-line text-main rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={formData.horaInicio}
                onChange={(e) =>
                  setFormData({ ...formData, horaInicio: e.target.value })
                }
              />
            </div>

            <div className="w-1/3">
              <label className="block text-sm font-medium text-main mb-1 flex items-center gap-1">
                <Palette className="w-4 h-4 text-muted" /> Color
              </label>
              <input
                type="color"
                className="w-full h-[42px] p-1 bg-background border border-line rounded-lg cursor-pointer focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-main font-medium hover:bg-border-line/30 border border-transparent rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creando || !formData.titulo}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-text font-medium hover:opacity-90 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {creando ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Crear Programa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
