import { Plus, Trash2 } from "lucide-react";
import { BloqueCalculado } from "@/lib/types";

type EscaletaTableProps = {
  bloques: BloqueCalculado[];
  actualizarBloque: (id: string, campo: any, valor: any) => void;
  eliminarBloque: (id: string) => void;
  agregarBloque: () => void;
  colorPrincipal: string;
  // Agregamos las propiedades booleanas al Tipado
  mostrarResponsable?: boolean;
  mostrarRecursos?: boolean;
  mostrarComentarios?: boolean;
};

export default function EscaletaTable({
  bloques,
  actualizarBloque,
  eliminarBloque,
  agregarBloque,
  colorPrincipal,
  mostrarResponsable,
  mostrarRecursos,
  mostrarComentarios,
}: EscaletaTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-colors dark:bg-gray-800 dark:border-gray-700">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            className="text-white text-sm"
            style={{ backgroundColor: colorPrincipal || "#f97316" }}
          >
            <th className="p-3 font-semibold w-12 text-center">No.</th>
            <th className="p-3 font-semibold w-20">Inicio</th>
            <th className="p-3 font-semibold w-20">Fin</th>
            <th className="p-3 font-semibold w-24">Dur (min)</th>
            <th className="p-3 font-semibold">Actividad</th>
            <th className="p-3 font-semibold">Participante</th>

            {/* ENCABEZADOS CONDICIONALES */}
            {mostrarResponsable && (
              <th className="p-3 font-semibold">Responsable</th>
            )}
            {mostrarRecursos && <th className="p-3 font-semibold">Recursos</th>}
            {mostrarComentarios && (
              <th className="p-3 font-semibold">Comentarios</th>
            )}

            <th className="p-3 font-semibold">Recursos / Notas</th>
            <th className="p-3 font-semibold w-12"></th>
          </tr>
        </thead>
        <tbody>
          {bloques.map((bloque: any, index) => (
            <tr
              key={bloque.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors group dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <td className="p-3 text-center text-sm font-medium text-gray-400">
                {index + 1}
              </td>
              <td className="p-3 text-sm font-mono font-medium text-gray-400">
                {bloque.horaInicioFormat}
              </td>
              <td className="p-3 text-sm font-mono font-medium text-gray-400">
                {bloque.horaFinFormat}
              </td>

              <td className="p-3 text-sm font-mono font-medium text-gray-400">
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

              {/* CELDAS CONDICIONALES DINÁMICAS */}
              {mostrarResponsable && (
                <td className="p-3">
                  <input
                    type="text"
                    value={bloque.responsable_tecnico || ""}
                    onChange={(e) =>
                      actualizarBloque(
                        bloque.id,
                        "responsable_tecnico",
                        e.target.value,
                      )
                    }
                    placeholder="Responsable técnico..."
                    className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-orange-500 focus:bg-white rounded px-2 py-1 text-sm outline-none transition-all"
                  />
                </td>
              )}

              {mostrarRecursos && (
                <td className="p-3">
                  <input
                    type="text"
                    value={bloque.url || ""}
                    onChange={(e) =>
                      actualizarBloque(bloque.id, "url", e.target.value)
                    }
                    placeholder="https://link-recurso.com"
                    className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-orange-500 focus:bg-white rounded px-2 py-1 text-sm outline-none transition-all font-mono text-xs text-blue-600 dark:text-blue-400"
                  />
                </td>
              )}

              {mostrarComentarios && (
                <td className="p-3">
                  <input
                    type="text"
                    value={bloque.comentarios_cabina || ""}
                    onChange={(e) =>
                      actualizarBloque(
                        bloque.id,
                        "comentarios_cabina",
                        e.target.value,
                      )
                    }
                    placeholder="Notas para producción..."
                    className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-orange-500 focus:bg-white rounded px-2 py-1 text-sm outline-none transition-all"
                  />
                </td>
              )}

              <td className="p-3">
                <textarea
                  value={bloque.recursos}
                  onChange={(e) =>
                    actualizarBloque(bloque.id, "recursos", e.target.value)
                  }
                  placeholder="Micrófonos, himnos, etc."
                  rows={1}
                  className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-orange-500 focus:bg-white rounded px-2 py-1 text-sm outline-none transition-all"
                />
              </td>

              <td className="p-3 text-center">
                <button
                  onClick={() => eliminarBloque(bloque.id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center dark:bg-gray-700 dark:border-gray-600">
        <button
          onClick={agregarBloque}
          className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-lg transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:text-blue-100 dark:hover:bg-gray-500"
        >
          <Plus className="w-4 h-4" /> Agregar Bloque
        </button>
      </div>
    </div>
  );
}
