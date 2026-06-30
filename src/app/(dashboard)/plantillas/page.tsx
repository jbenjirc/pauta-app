import { Star, LayoutTemplate } from "lucide-react";

export default function PlantillasPage() {
  return (
    <div className="flex flex-col gap-6 p-8 w-full max-w-6xl mx-auto h-full">
      <header className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold text-main">Plantillas</h1>
        <p className="text-muted">
          Acelera tu flujo de trabajo utilizando estructuras predefinidas.
        </p>
      </header>

      <div className="flex-1 bg-surface border border-dashed border-line rounded-2xl flex flex-col items-center justify-center text-center p-12 transition-colors">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <LayoutTemplate className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-main mb-2">
          Galería en construcción
        </h3>
        <p className="text-muted max-w-md mx-auto">
          Próximamente podrás guardar tus escaletas favoritas como plantillas
          base o explorar las configuraciones estándar del sistema.
        </p>
      </div>
    </div>
  );
}
