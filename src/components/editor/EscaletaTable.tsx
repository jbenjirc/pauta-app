// components/editor/EscaletaTable.tsx
import { Plus, Trash2, Share2, GripVertical } from "lucide-react";

export default function EscaletaTable({
  bloques,
  colorPrincipal,
  mostrarResponsable,
  mostrarRecursos,
  mostrarComentarios,
  actualizarBloque,
  eliminarBloque,
  agregarBloque,
}: any) {
  // Aseguramos un color por defecto usando nuestras variables CSS
  const headerStyle = {
    backgroundColor: colorPrincipal || "var(--brand-primary)",
    color: "#ffffff", // Asumimos texto blanco para contraste sobre el color dinámico
  };

  return (
    <div className="rounded-2xl border border-border-line bg-surface overflow-hidden shadow-xl mb-12">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[1000px]">
          <thead
            style={headerStyle}
            className="text-xs uppercase tracking-wider"
          >
            <tr>
              <th className="px-4 py-4 font-bold w-12 text-center">No</th>
              <th className="px-4 py-4 font-bold w-24">Inicio</th>
              <th className="px-4 py-4 font-bold w-24">Fin</th>
              <th className="px-4 py-4 font-bold w-20">Dur (min)</th>
              <th className="px-4 py-4 font-bold min-w-[200px]">Actividad</th>
              <th className="px-4 py-4 font-bold min-w-[150px]">
                Participante
              </th>
              <th className="px-4 py-4 font-bold min-w-[150px]">Notas</th>

              {mostrarResponsable && (
                <th className="px-4 py-4 font-bold">Responsable</th>
              )}
              {mostrarRecursos && (
                <th className="px-4 py-4 font-bold">Recursos</th>
              )}
              {mostrarComentarios && (
                <th className="px-4 py-4 font-bold">Cabina</th>
              )}

              <th className="px-4 py-4 font-bold w-32 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-line bg-surface">
            {bloques.map((bloque: any, index: number) => (
              <tr
                key={bloque.id}
                className="group hover:bg-bg-app/50 transition-colors"
              >
                <td className="px-4 py-3 text-center text-text-muted font-mono text-sm">
                  {index + 1}
                </td>

                {/* Inicio Calculado */}
                <td className="px-4 py-3 font-mono font-bold text-primary">
                  {bloque.horaInicioFormat}
                </td>

                {/* Fin Calculado */}
                <td className="px-4 py-3 font-mono text-text-muted">
                  {bloque.horaFinFormat}
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={bloque.duracion || 0}
                    onChange={(e) =>
                      actualizarBloque(
                        bloque.id,
                        "duracion",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-16 p-1 bg-background border border-border-line rounded outline-none focus:border-primary text-center"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={bloque.actividad || ""}
                    placeholder="Ej: Bienvenida..."
                    onChange={(e) =>
                      actualizarBloque(bloque.id, "actividad", e.target.value)
                    }
                    className="w-full bg-transparent outline-none text-text-main font-medium placeholder:opacity-40"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={bloque.participante || ""}
                    placeholder="Nombre..."
                    onChange={(e) =>
                      actualizarBloque(
                        bloque.id,
                        "participante",
                        e.target.value,
                      )
                    }
                    className="w-full bg-transparent outline-none text-text-muted"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={bloque.notas_bloque || ""}
                    placeholder="Notas de bloque..."
                    onChange={(e) =>
                      actualizarBloque(
                        bloque.id,
                        "notas_bloque",
                        e.target.value,
                      )
                    }
                    className="w-full bg-transparent outline-none text-text-muted text-sm"
                  />
                </td>

                {/* Columnas Toggled */}
                {mostrarResponsable && (
                  <td className="px-4 py-3">
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
                      className="w-full bg-transparent outline-none text-text-muted"
                    />
                  </td>
                )}
                {mostrarRecursos && (
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={bloque.recursos_drive_url || ""}
                      onChange={(e) =>
                        actualizarBloque(
                          bloque.id,
                          "recursos_drive_url",
                          e.target.value,
                        )
                      }
                      className="w-full bg-transparent outline-none text-primary text-sm"
                    />
                  </td>
                )}
                {mostrarComentarios && (
                  <td className="px-4 py-3">
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
                      className="w-full bg-transparent outline-none text-danger text-sm"
                    />
                  </td>
                )}

                <td className="px-4 py-3 text-center flex items-center justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                  <button
                    title="Reorganizar (Drag)"
                    className="p-1.5 text-text-muted hover:text-primary cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <button
                    title="Compartir bloque"
                    className="p-1.5 text-text-muted hover:text-primary transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    title="Eliminar bloque"
                    onClick={() => eliminarBloque(bloque.id)}
                    className="p-1.5 text-danger hover:bg-danger/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={agregarBloque}
        className="w-full py-4 flex items-center justify-center gap-2 text-primary hover:bg-bg-app transition-all font-bold"
      >
        <Plus className="w-5 h-5" />
        Agregar bloque
      </button>
    </div>
  );
}
