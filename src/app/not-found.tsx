// src/app/not-found.tsx
import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
        <Compass className="w-10 h-10 text-primary animate-pulse" />
      </div>

      <h1 className="text-6xl font-extrabold text-main mb-4 tracking-tight">
        404
      </h1>

      <h2 className="text-2xl font-bold text-main mb-2">Ruta no encontrada</h2>

      <p className="text-muted max-w-md mx-auto mb-8">
        Parece que te has desviado de la escaleta. La página que buscas no
        existe o ha sido movida.
      </p>

      <Link
        href="/"
        className="bg-primary text-primary-text font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm"
      >
        Regresar al inicio
      </Link>
    </div>
  );
}
