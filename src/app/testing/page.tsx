"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Type, Square, CheckCircle, Search } from "lucide-react";

export default function TestingPage() {
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

  // Arreglo optimizado para Tailwind v4: Clases estáticas 100% legibles por el compilador JIT
  const paleta = [
    {
      nombre: "Punch Red",
      bg: "bg-punch-red",
      hoverBg: "hover:bg-punch-red",
      text: "text-punch-red",
      border: "border-punch-red",
      ring: "focus:ring-punch-red",
      bgLight: "bg-punch-red-100 dark:bg-punch-red-900/30",
      textContrast: "text-white",
      hoverTextContrast: "hover:text-white",
    },
    {
      nombre: "Honeydew",
      bg: "bg-honeydew",
      hoverBg: "hover:bg-honeydew",
      text: "text-honeydew",
      border: "border-honeydew",
      ring: "focus:ring-honeydew",
      bgLight: "bg-honeydew-100 dark:bg-honeydew-900/30",
      textContrast: "text-gray-900",
      hoverTextContrast: "hover:text-gray-900",
    },
    {
      nombre: "Frosted Blue",
      bg: "bg-frosted-blue",
      hoverBg: "hover:bg-frosted-blue",
      text: "text-frosted-blue",
      border: "border-frosted-blue",
      ring: "focus:ring-frosted-blue",
      bgLight: "bg-frosted-blue-100 dark:bg-frosted-blue-900/30",
      textContrast: "text-gray-900",
      hoverTextContrast: "hover:text-gray-900",
    },
    {
      nombre: "Cerulean",
      bg: "bg-cerulean",
      hoverBg: "hover:bg-cerulean",
      text: "text-cerulean",
      border: "border-cerulean",
      ring: "focus:ring-cerulean",
      bgLight: "bg-cerulean-100 dark:bg-cerulean-900/30",
      textContrast: "text-white",
      hoverTextContrast: "hover:text-white",
    },
    {
      nombre: "Oxford Navy",
      bg: "bg-oxford-navy",
      hoverBg: "hover:bg-oxford-navy",
      text: "text-oxford-navy",
      border: "border-oxford-navy",
      ring: "focus:ring-oxford-navy",
      bgLight: "bg-oxford-navy-100 dark:bg-oxford-navy-900/30",
      textContrast: "text-white",
      hoverTextContrast: "hover:text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8 transition-colors duration-300">
      {/* CABECERA Y CONTROLES */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Laboratorio de UI</h1>
          <p className="opacity-70 mt-1">
            Prueba de colores de marca y componentes para el editor de
            escaletas.
          </p>
        </div>

        <button
          onClick={() => setIsDark(!isDark)}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-line text-text-main rounded-xl shadow-sm hover:opacity-80 transition-colors"
        >
          {isDark ? (
            <>
              <Sun className="w-5 h-5 text-yellow-500" /> Modo Claro
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-indigo-500" /> Modo Oscuro
            </>
          )}
        </button>
      </div>

      {/* GRID DE COLORES */}
      <div className="max-w-6xl mx-auto space-y-12">
        {paleta.map((color) => (
          <div
            key={color.nombre}
            className="p-6 bg-surface/50 dark:bg-surface/30 backdrop-blur-sm rounded-2xl shadow-sm border border-border-line transition-colors"
          >
            <h2
              className={`text-xl font-bold mb-6 flex items-center gap-2 ${color.text}`}
            >
              <Square className={`w-5 h-5 ${color.text} fill-current`} />
              {color.nombre}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Bloque 1: Fondos y Tarjetas */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold opacity-50 uppercase tracking-wider flex items-center gap-2">
                  <Square className="w-4 h-4" /> Fondos
                </h3>
                <div
                  className={`h-24 rounded-xl flex items-center justify-center font-medium shadow-sm ${color.bg}`}
                >
                  <span className={`${color.textContrast}`}>
                    Fondo Principal
                  </span>
                </div>
                <div
                  className={`h-24 rounded-xl flex items-center justify-center font-medium ${color.bgLight}`}
                >
                  <span className={color.text}>Fondo Suave</span>
                </div>
              </div>

              {/* Bloque 2: Tipografía */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold opacity-50 uppercase tracking-wider flex items-center gap-2">
                  <Type className="w-4 h-4" /> Textos
                </h3>
                <h4 className={`text-2xl font-bold ${color.text}`}>
                  Encabezado {color.nombre}
                </h4>
                <p className="opacity-80 text-sm">
                  Este es un texto neutral con un enlace{" "}
                  <a
                    href="#"
                    className={`font-medium hover:underline ${color.text}`}
                  >
                    del color de la marca
                  </a>{" "}
                  para ver el contraste.
                </p>
                <div
                  className={`p-4 border-l-4 rounded-r-lg bg-background/50 ${color.border}`}
                >
                  <p className={`text-sm font-medium ${color.text}`}>
                    Nota importante resaltada.
                  </p>
                </div>
              </div>

              {/* Bloque 3: Botones */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold opacity-50 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Botones
                </h3>
                <div className="flex flex-col gap-3">
                  {/* Botón Sólido */}
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-80 ${color.bg} ${color.textContrast}`}
                  >
                    Botón Principal
                  </button>
                  {/* Botón Outline - Corregido para Tailwind JIT */}
                  <button
                    className={`px-4 py-2 rounded-lg font-medium border-2 transition-colors ${color.hoverBg} ${color.hoverTextContrast} ${color.border} ${color.text}`}
                  >
                    Botón Secundario
                  </button>
                  {/* Botón Fantasma */}
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors hover:bg-background/80 ${color.text}`}
                  >
                    Botón Fantasma
                  </button>
                </div>
              </div>

              {/* Bloque 4: Inputs y Formularios */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold opacity-50 uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4" /> Inputs
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Cuadro de texto..."
                    className={`w-full px-4 py-2 rounded-lg bg-surface border border-border-line outline-none transition-all focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-background ${color.ring} ${color.border}`}
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className={`w-5 h-5 rounded ${color.text} ${color.ring}`}
                    />
                    <span className="text-sm">Checkbox</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      className={`w-5 h-5 ${color.text} ${color.ring}`}
                    />
                    <span className="text-sm">Radio button</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
