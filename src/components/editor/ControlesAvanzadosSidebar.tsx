// components/editor/ControlesAvanzadosSidebar.tsx
import { X, Tv, Layout, Palette, Users } from "lucide-react";

export default function ControlesAvanzadosSidebar({
  isOpen,
  onClose,
  avanzados,
  setAvanzados,
}: any) {
  const handleChange = (field: string, value: any) => {
    setAvanzados({ ...avanzados, [field]: value });
  };

  const toggleCol = (col: string) => {
    setAvanzados({ ...avanzados, [col]: !avanzados[col] });
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-oxford-navy/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose} // Cierra al hacer clic fuera
      />

      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-surface z-50 shadow-2xl transition-transform duration-500 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-8 border-b border-border-line pb-4">
            <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Tv className="text-primary" />
              Configuración de Mesa
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-app rounded-full transition-colors text-text-muted"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 space-y-8 pr-2">
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4" /> Personal de Cabina
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-text-muted font-bold block mb-1">
                    Hora Inicio del Stream
                  </label>
                  <input
                    type="time"
                    value={avanzados?.hora_inicio_stream || ""}
                    onChange={(e) =>
                      handleChange("hora_inicio_stream", e.target.value)
                    }
                    className="w-full p-3 bg-bg-app border border-border-line rounded-xl text-text-main outline-none focus:border-primary"
                  />
                  <p className="text-xs text-text-muted mt-1 opacity-70">
                    Útil si la transmisión comienza antes del programa en vivo.
                  </p>
                </div>
                <div>
                  <label className="text-xs text-text-muted font-bold block mb-1">
                    Floor Manager
                  </label>
                  <input
                    type="text"
                    value={avanzados?.floor_manager || ""}
                    onChange={(e) =>
                      handleChange("floor_manager", e.target.value)
                    }
                    className="w-full p-3 bg-bg-app border border-border-line rounded-xl text-text-main outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted font-bold block mb-1">
                    Director Técnico
                  </label>
                  <input
                    type="text"
                    value={avanzados?.director_tecnico || ""}
                    onChange={(e) =>
                      handleChange("director_tecnico", e.target.value)
                    }
                    className="w-full p-3 bg-bg-app border border-border-line rounded-xl text-text-main outline-none focus:border-primary"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Layout className="w-4 h-4" /> Columnas Visibles
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: "mostrar_col_responsable",
                    label: "Responsable Técnico",
                  },
                  {
                    id: "mostrar_col_recursos",
                    label: "Recursos Drive / Links",
                  },
                  { id: "mostrar_col_comentarios", label: "Notas de Cabina" },
                ].map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border-line hover:border-primary cursor-pointer transition-all bg-bg-app/50"
                  >
                    <span className="text-text-main text-sm font-medium">
                      {col.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!avanzados?.[col.id]}
                      onChange={() => toggleCol(col.id)}
                      className="w-5 h-5 accent-primary"
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-4 h-4" /> Color de Identidad
              </h3>
              <input
                type="color"
                value={avanzados?.color_escaleta || "#457b9d"}
                onChange={(e) => handleChange("color_escaleta", e.target.value)}
                className="w-full h-12 rounded-xl cursor-pointer bg-transparent border-none"
              />
            </section>
          </div>
        </div>
      </aside>
    </>
  );
}
