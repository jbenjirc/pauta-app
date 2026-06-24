import Link from "next/link";
import { Globe } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
        >
          Pauta App
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Botón de Idioma */}
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
  );
}
