"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Moon, Sun } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  // Estado para el modo oscuro
  const [isDark, setIsDark] = useState(false);

  // Sincronizamos el estado local con la clase 'dark' del HTML
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDark]);

  // Se oculta si estamos en el editor o en el dashboard
  if (pathname?.startsWith("/editor") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    /* Corregimos bg-app por bg-background y agregamos transición suave */
    <header className="w-full bg-background border-b border-border-line px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="text-xl font-bold text-text-main hover:opacity-80 transition-opacity"
        >
          Pauta App
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* NUEVO: Botón de Modo Oscuro compacto */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-main hover:bg-surface transition-colors"
          aria-label="Alternar tema"
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-yellow-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {/* Selector de idioma */}
        <button className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-main transition-colors px-2 py-1 rounded-md hover:bg-surface">
          <Globe className="w-4 h-4" />
          <span>ES</span>
        </button>

        {/* Separador vertical */}
        <div className="h-5 w-px bg-border-line mx-2 hidden sm:block"></div>

        {/* Enlace Iniciar Sesión */}
        <Link
          href="/entrar"
          className="text-sm font-medium text-text-main hover:text-primary transition-colors"
        >
          Iniciar Sesión
        </Link>

        {/* Botón Registrarse */}
        <Link
          href="/registro"
          className="text-sm font-medium bg-primary text-primary-text hover:opacity-90 px-4 py-2 rounded-lg transition-all shadow-sm"
        >
          Registrarse
        </Link>
      </div>
    </header>
  );
}
