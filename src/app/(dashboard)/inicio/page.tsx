import { Search, Clock, Zap } from "lucide-react";

export default function InicioPage() {
  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-6xl mx-auto">
      {/* Cabecera */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-main">Hola, buen día.</h1>
        <p className="text-muted">
          Aquí tienes un resumen de tu actividad y accesos rápidos.
        </p>
      </header>

      {/* Barra de Búsqueda */}
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder="Buscar escaletas, proyectos o plantillas..."
          className="w-full pl-12 pr-4 py-3 bg-surface border border-line rounded-xl text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
        />
      </div>

      {/* Grilla de Acceso Rápido */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-line flex flex-col gap-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-main">Recientes</h3>
            <p className="text-sm text-muted">Continúa donde te quedaste.</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-line flex flex-col gap-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-main">Plantillas destacadas</h3>
            <p className="text-sm text-muted">
              Inicia rápido con estructuras base.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
