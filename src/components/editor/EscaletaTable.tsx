// src/components/editor/EscaletaTable.tsx
import { Plus, Trash2 } from "lucide-react";
import { Bloque, BloqueCalculado } from "@/lib/types";

type EscaletaTableProps = {
  bloques: BloqueCalculado[];
  actualizarBloque: (id: string, campo: keyof Bloque, valor: any) => void;
  eliminarBloque: (id: string) => void;
  agregarBloque: () => void;
  colorPrincipal?: string;
};

export default function EscaletaTable({
  bloques,
  actualizarBloque,
  eliminarBloque,
  agregarBloque,
  colorPrincipal,
}: EscaletaTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            className="text-white text-sm"
            style={{ backgroundColor: colorPrincipal || "#F97316" }}
          >
            <th className="p-3 font-semibold w-12 text-center">No.</th>
            <th className="p-3 font-semibold w-20">Inicio</th>
            <th className="p-3 font-semibold w-20">Fin</th>
            <th className="p-3 font-semibold w-24">Dur (min)</th>
            <th className="p-3 font-semibold">Actividad</th>
            <th className="p-3 font-semibold">Participante</th>
            <th className="p-3 font-semibold">Recursos / Notas</th>
            <th className="p-3 font-semibold w-12"></th>
          </tr>
        </thead>
        <tbody>
          {bloques.map((bloque, index) => (
            <tr
              key={bloque.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <td className="p-3 text-center text-sm font-medium text-gray-400">
                {index + 1}
              </td>

              <td className="p-3 text-sm font-mono font-medium text-gray-600 bg-gray-50/50">
                {bloque.horaInicioFormat}
              </td>
              <td className="p-3 text-sm font-mono font-medium text-gray-600 bg-gray-50/50">
                {bloque.horaFinFormat}
              </td>

              <td className="p-3">
                <input
                  type="number"
                  value={bloque.duracion || ""}
                  onChange={(e) =>
                    actualizarBloque(
                      bloque.id,
                      "duracion",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  min="0"
                />
              </td>

              <td className="p-3">
                <input
                  type="text"
                  value={bloque.actividad}
                  onChange={(e) =>
                    actualizarBloque(bloque.id, "actividad", e.target.value)
                  }
                  placeholder="Ej. Oración..."
                  className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-orange-500 focus:bg-white rounded px-2 py-1 text-sm outline-none transition-all"
                />
              </td>

              <td className="p-3">
                <input
                  type="text"
                  value={bloque.participante}
                  onChange={(e) =>
                    actualizarBloque(bloque.id, "participante", e.target.value)
                  }
                  placeholder="Nombre..."
                  className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-orange-500 focus:bg-white rounded px-2 py-1 text-sm outline-none transition-all"
                />
              </td>

              <td className="p-3">
                <textarea
                  value={bloque.recursos}
                  onChange={(e) =>
                    actualizarBloque(bloque.id, "recursos", e.target.value)
                  }
                  placeholder="Micrófonos, himnos, etc."
                  rows={1}
                  className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-orange-500 focus:bg-white rounded px-2 py-1 text-sm outline-none resize-none transition-all"
                />
              </td>

              <td className="p-3 text-center">
                <button
                  onClick={() => eliminarBloque(bloque.id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  title="Eliminar bloque"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center">
        <button
          onClick={agregarBloque}
          className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar Bloque
        </button>
      </div>
    </div>
  );
}
