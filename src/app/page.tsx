import Link from "next/link";
import { Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">Pauta App</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Botón de Idioma (Preparado para CMS) */}
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-100">
            <Globe className="w-4 h-4" />
            <span>ES</span>
          </button>

          <div className="h-5 w-px bg-gray-300 mx-2 hidden sm:block"></div>

          {/* Botones de Autenticación */}
          <Link
            href="/entrar"
            className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/registro"
            className="text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-16 md:mt-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 max-w-3xl">
          El control total de tus tiempos,{" "}
          <span className="text-orange-600">en vivo.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl">
          Crea, edita y exporta a PDF tus escaletas multimedia. Una herramienta
          diseñada para evitar fricciones en cabina y asegurar que cada momento
          ocurra en el segundo exacto.
        </p>
        <div className="flex gap-4">
          <Link
            href="/registro"
            className="text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl transition-colors shadow-md"
          >
            Comenzar ahora
          </Link>
        </div>
      </main>
    </div>
  );
}
