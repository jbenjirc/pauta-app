// components/editor/EscaletaTable.tsx
import { Plus, Trash2, GripVertical, FileText } from "lucide-react";

export default function EscaletaTable({
  bloques,
  actualizarBloque,
  eliminarBloque,
  agregarBloque,
  colorPrincipal,
}: any) {
  return (
    <div className="rounded-2xl border border-border-line bg-surface overflow-hidden shadow-xl">
      <table className="w-full border-collapse text-left">
        <thead className="bg-background/50 text-text-muted text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-4 font-medium w-12 text-center">#</th>
            <th className="px-4 py-4 font-medium w-24">Inicio</th>
            <th className="px-4 py-4 font-medium w-20">Min</th>
            <th className="px-4 py-4 font-medium">Actividad / Segmento</th>
            <th className="px-4 py-4 font-medium">Participante</th>
            <th className="px-4 py-4 font-medium w-16 text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-line">
          {bloques.map((bloque: any, index: number) => (
            <tr
              key={bloque.id}
              className="group hover:bg-primary/5 transition-colors"
            >
              <td className="px-4 py-3 text-center text-text-muted font-mono text-sm">
                {index + 1}
              </td>
              <td className="px-4 py-3 font-mono font-bold text-primary">
                {bloque.hora_inicio || "00:00"}
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={bloque.duracion}
                  onChange={(e) =>
                    actualizarBloque(
                      bloque.id,
                      "duracion",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-12 bg-transparent outline-none focus:text-primary font-bold"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={bloque.actividad}
                  placeholder="Ej: Bienvenida y Oración..."
                  onChange={(e) =>
                    actualizarBloque(bloque.id, "actividad", e.target.value)
                  }
                  className="w-full bg-transparent outline-none text-text-main font-medium placeholder:italic placeholder:opacity-20"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={bloque.participante}
                  placeholder="Nombre..."
                  onChange={(e) =>
                    actualizarBloque(bloque.id, "participante", e.target.value)
                  }
                  className="w-full bg-transparent outline-none text-text-muted"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => eliminarBloque(bloque.id)}
                  className="p-2 text-danger opacity-0 group-hover:opacity-100 hover:bg-danger/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={agregarBloque}
        className="w-full py-4 flex items-center justify-center gap-2 text-primary hover:bg-primary hover:text-primary-text transition-all font-bold border-t border-dashed border-border-line"
      >
        <Plus className="w-5 h-5" />
        Añadir nuevo bloque
      </button>
    </div>
  );
}
