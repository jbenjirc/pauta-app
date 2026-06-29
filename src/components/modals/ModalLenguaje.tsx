"use client";

import { useEffect } from "react";
import { X, Check } from "lucide-react";

// 1. Aquí le definimos a TypeScript las reglas del juego (Los Tipos)
interface ModalLenguajeProps {
  isOpen: boolean; // isOpen siempre será un booleano (true/false)
  onClose: () => void; // onClose es una función que no devuelve nada (void)
  currentLang?: string; // El signo '?' significa que es opcional, porque ya tiene "ES" por defecto
}

// 1. Agregamos la nueva función a las reglas
interface ModalLenguajeProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: string;
  // NUEVO: Esta función recibe un texto (string) que será el código del idioma
  onLanguageSelect: (langCode: string) => void;
}

// 2. Le decimos a la función que respete esas reglas añadiendo ": ModalLenguajeProps"
export default function ModalLenguaje({
  isOpen,
  onClose,
  currentLang = "ES",
  onLanguageSelect,
}: ModalLenguajeProps) {
  // Cerrar modal con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // <-- También tipamos el evento aquí
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const languages = [
    { code: "ES", name: "Español" },
    { code: "EN", name: "English" },
    { code: "PT", name: "Português" },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-surface border border-border-line rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-line">
          <h3 className="font-bold text-text-main">Idioma / Language</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:text-text-main hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageSelect(lang.code); // Llamamos a la función pasada desde el Navbar
                onClose();
                console.log("Cambiar a:", lang.code);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                currentLang === lang.code
                  ? "bg-background text-primary font-medium"
                  : "text-text-main hover:bg-background/50 hover:text-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm border border-border-line bg-surface px-2 py-0.5 rounded text-text-muted font-mono">
                  {lang.code}
                </span>
                <span>{lang.name}</span>
              </div>

              {currentLang === lang.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
