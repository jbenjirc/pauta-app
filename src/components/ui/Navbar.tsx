"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Moon, Sun } from "lucide-react";
import LenguajeModal from "@/components/modals/ModalLenguaje";
import { useTranslation } from "@/contextos/LanguageContext";
import { useTheme } from "next-themes"; // Importación directa

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, currentLang } = useTranslation();

  // Escudo de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith("/editor") || pathname?.startsWith("/inicio")) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="w-full bg-surface border-b border-line px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xl font-bold text-main hover:opacity-80 transition-opacity"
          >
            Pauta App
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted hover:text-main hover:bg-border-line/20 transition-colors"
            aria-label="Alternar tema"
          >
            {/* Si no ha montado, mostramos el botón vacío para mantener el width/height */}
            {mounted &&
              (resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              ))}
          </button>

          <button
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-main transition-colors px-2 py-1 rounded-md hover:bg-border-line/20"
          >
            <Globe className="w-4 h-4" />
            <span>{currentLang}</span>
          </button>

          <div className="h-5 w-px bg-line mx-2 hidden sm:block"></div>

          <Link
            href="/entrar"
            className="text-sm font-medium text-main hover:text-primary transition-colors"
          >
            {t("navbar.login")}
          </Link>

          <Link
            href="/registro"
            className="text-sm font-medium bg-primary text-primary-text hover:opacity-90 px-4 py-2 rounded-lg transition-all shadow-sm"
          >
            {t("navbar.register")}
          </Link>
        </div>
      </header>

      <LenguajeModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </>
  );
}
