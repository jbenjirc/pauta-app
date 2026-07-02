// components/editor/ControlesAvanzadosSidebar.tsx
import { X, CheckCircle2, Tv, Layout, Palette } from "lucide-react";

export default function ControlesAvanzadosSidebar({
  isOpen,
  onClose,
  avanzados,
  setAvanzados,
  onGuardarAvanzados,
  guardando,
}: any) {
  const toggleCol = (col: string) => {
    setAvanzados({ ...avanzados, [col]: !avanzados[col] });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-oxford-navy/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-surface z-50 shadow-2xl transition-transform duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Tv className="text-primary" />
              Configuración de Mesa
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto">
            {/* Sección Columnas */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Layout className="w-4 h-4" /> Visualización de Columnas
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "mostrar_col_responsable",
                    label: "Responsable Técnico",
                  },
                  {
                    id: "mostrar_col_recursos",
                    label: "Recursos Drive / Links",
                  },
                  {
                    id: "mostrar_col_comentarios",
                    label: "Comentarios Cabina",
                  },
                ].map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border-line hover:border-primary cursor-pointer transition-all"
                  >
                    <span className="text-text-main font-medium">
                      {col.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={avanzados?.[col.id]}
                      onChange={() => toggleCol(col.id)}
                      className="w-5 h-5 accent-primary"
                    />
                  </label>
                ))}
              </div>
            </section>

            {/* Sección Personalización */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-4 h-4" /> Color de Identidad
              </h3>
              <input
                type="color"
                value={avanzados?.color_escaleta || "#457b9d"}
                onChange={(e) =>
                  setAvanzados({ ...avanzados, color_escaleta: e.target.value })
                }
                className="w-full h-12 rounded-lg cursor-pointer bg-transparent border-none"
              />
            </section>
          </div>

          <button
            onClick={onGuardarAvanzados}
            disabled={guardando}
            className="w-full py-4 bg-primary text-primary-text rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
          >
            {guardando ? (
              "Guardando..."
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> Guardar todo
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
