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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">
            Configurar Escaleta
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Programa
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Escuela sabática"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Fecha
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData({ ...formData, fecha: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Hora
              </label>
              <input
                type="time"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.horaInicio}
                onChange={(e) =>
                  setFormData({ ...formData, horaInicio: e.target.value })
                }
              />
            </div>

            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Palette className="w-4 h-4" /> Color
              </label>
              <input
                type="color"
                className="w-full h-[42px] p-1 border border-gray-300 rounded-lg cursor-pointer"
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
              className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creando || !formData.titulo}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-medium hover:bg-black rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
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
