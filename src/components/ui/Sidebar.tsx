"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Plus,
  Home,
  Star,
  Folder,
  Compass,
  Settings,
  User,
} from "lucide-react";

export default function Sidebar() {
  // Estado para controlar si la barra está abierta o cerrada
  const [colapsado, setColapsado] = useState(false);
  const pathname = usePathname();

  // Función auxiliar para pintar el botón si estamos en esa ruta
  const isActive = (ruta: string) => pathname === ruta;

  return (
    <aside
      className={`${
        colapsado ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 sticky top-0 shrink-0 z-40`}
    >
      {/* SECCIÓN SUPERIOR */}
      <div className="p-4 flex flex-col gap-6">
        {/* Botón de ocultar/mostrar */}
        <button
          onClick={() => setColapsado(!colapsado)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg self-start transition-colors"
          title="Colapsar menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Links principales */}
        <nav className="flex flex-col gap-2">
          {/* Botón Crear (Resaltado) */}
          <button className="flex items-center gap-3 p-3 text-white bg-gray-900 hover:bg-black rounded-xl transition-colors shadow-sm">
            <Plus className="w-5 h-5 shrink-0" />
            {!colapsado && (
              <span className="font-semibold truncate">Crear</span>
            )}
          </button>

          <Link
            href="/dashboard"
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              isActive("/dashboard")
                ? "bg-orange-50 text-orange-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            {!colapsado && <span className="font-medium truncate">Inicio</span>}
          </Link>

          <Link
            href="/plantillas"
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              isActive("/plantillas")
                ? "bg-orange-50 text-orange-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Star className="w-5 h-5 shrink-0" />
            {!colapsado && (
              <span className="font-medium truncate">Plantillas</span>
            )}
          </Link>

          <Link
            href="/programas"
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              isActive("/programas")
                ? "bg-orange-50 text-orange-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Folder className="w-5 h-5 shrink-0" />
            {!colapsado && (
              <span className="font-medium truncate">Programas</span>
            )}
          </Link>

          <Link
            href="/explorar"
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              isActive("/explorar")
                ? "bg-orange-50 text-orange-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Compass className="w-5 h-5 shrink-0" />
            {!colapsado && (
              <span className="font-medium truncate">Explorar</span>
            )}
          </Link>
        </nav>
      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="mt-auto p-4 flex flex-col gap-2 border-t border-gray-100">
        {/* Perfil */}
        <Link
          href="/perfil"
          className={`flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group ${
            colapsado ? "p-2 justify-center" : "p-3"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-orange-400 transition-colors">
            {/* Aquí después puedes poner una etiqueta <img /> cuando tengas la foto real */}
            <User className="w-5 h-5 text-gray-500" />
          </div>
          {!colapsado && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm">Mi Perfil</span>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
