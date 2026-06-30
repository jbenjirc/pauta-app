"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Plus,
  Home,
  List,
  Star,
  FolderOpen,
  Compass,
} from "lucide-react";
import PerfilMultitool from "./PerfilMultitool";

interface SidebarProps {
  onOpenCreateModal: () => void;
}

export default function Sidebar({ onOpenCreateModal }: SidebarProps) {
  const [colapsado, setColapsado] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const isActive = (ruta: string) => pathname?.startsWith(ruta);

  // Escudo de hidratación y lectura de LocalStorage
  useEffect(() => {
    setIsMounted(true);
    const estadoGuardado = localStorage.getItem("sidebar-colapsado");
    if (estadoGuardado === "true") {
      setColapsado(true);
    }
  }, []);

  const toggleSidebar = () => {
    const nuevoEstado = !colapsado;
    setColapsado(nuevoEstado);
    localStorage.setItem("sidebar-colapsado", String(nuevoEstado));
  };

  const navItemBaseClass =
    "w-full flex items-center justify-start px-3 gap-3 h-12 rounded-xl transition-colors overflow-hidden";

  // Prevenir saltos visuales durante SSR
  if (!isMounted)
    return (
      <aside className="w-64 bg-surface border-r border-line h-screen shrink-0 z-40 hidden sm:block" />
    );

  return (
    <aside
      className={`${
        colapsado ? "w-20" : "w-64"
      } bg-surface border-r border-line h-screen flex flex-col transition-all duration-300 sticky top-0 shrink-0 z-40`}
    >
      <div className="p-4 flex flex-col gap-6">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-start px-2 text-muted hover:bg-border-line/30 rounded-lg transition-colors"
          title="Colapsar menú"
        >
          <Menu className="w-6 h-6 shrink-0" />
        </button>

        <nav className="flex flex-col gap-2">
          {/* Botón Crear */}
          <button
            onClick={onOpenCreateModal}
            className={`${navItemBaseClass} text-primary-text bg-primary hover:opacity-90 shadow-sm`}
          >
            <Plus className="w-5 h-5 shrink-0" />
            {!colapsado && (
              <span className="font-semibold truncate">Crear</span>
            )}
          </button>

          <Link
            href="/inicio"
            className={`${navItemBaseClass} ${
              isActive("/inicio")
                ? "bg-primary/10 text-primary"
                : "text-main hover:bg-border-line/20"
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            {!colapsado && <span className="font-medium truncate">Inicio</span>}
          </Link>

          <Link
            href="/escaletas"
            className={`${navItemBaseClass} ${
              isActive("/escaletas")
                ? "bg-primary/10 text-primary"
                : "text-main hover:bg-border-line/20"
            }`}
          >
            <List className="w-5 h-5 shrink-0" />
            {!colapsado && (
              <span className="font-medium truncate">Escaletas</span>
            )}
          </Link>

          <Link
            href="/plantillas"
            className={`${navItemBaseClass} ${
              isActive("/plantillas")
                ? "bg-primary/10 text-primary"
                : "text-main hover:bg-border-line/20"
            }`}
          >
            <Star className="w-5 h-5 shrink-0" />
            {!colapsado && (
              <span className="font-medium truncate">Plantillas</span>
            )}
          </Link>

          <Link
            href="/proyectos"
            className={`${navItemBaseClass} ${
              isActive("/proyectos")
                ? "bg-primary/10 text-primary"
                : "text-main hover:bg-border-line/20"
            }`}
          >
            <FolderOpen className="w-5 h-5 shrink-0" />
            {!colapsado && (
              <span className="font-medium truncate">Proyectos</span>
            )}
          </Link>

          <Link
            href="/explorar"
            className={`${navItemBaseClass} ${
              isActive("/explorar")
                ? "bg-primary/10 text-primary"
                : "text-main hover:bg-border-line/20"
            }`}
          >
            <Compass className="w-5 h-5 shrink-0" />
            {!colapsado && (
              <span className="font-medium truncate">Explorar</span>
            )}
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4 flex flex-col gap-2 border-t border-line">
        <PerfilMultitool colapsado={colapsado} />
      </div>
    </aside>
  );
}
