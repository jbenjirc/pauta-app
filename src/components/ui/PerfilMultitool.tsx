// components/layout/PerfilMultitool.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, LogOut, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession } from "@/contextos/SessionContext";

interface PerfilMultitoolProps {
  colapsado?: boolean;
}

export default function PerfilMultitool({
  colapsado = false,
}: PerfilMultitoolProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="relative group w-full">
      {/* Menú desplegable (hacia arriba) */}
      <div className="absolute bottom-full left-0 mb-2 w-48 bg-surface border border-line rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        <div className="flex flex-col p-1">
          <Link
            href="/perfil"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-main hover:bg-border-line/30 rounded-lg transition-colors"
          >
            <User className="w-4 h-4 text-muted" /> Mi perfil
          </Link>
          <Link
            href="/configuracion"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-main hover:bg-border-line/30 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-muted" /> Configuración
          </Link>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-main hover:bg-border-line/30 rounded-lg transition-colors text-left"
          >
            {!mounted ? (
              <div className="w-4 h-4 opacity-0" />
            ) : resolvedTheme === "light" ? (
              <>
                <Moon className="w-4 h-4 text-muted" />
                <span>Modo oscuro</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-muted" />
                <span>Modo claro</span>
              </>
            )}
          </button>

          <hr className="my-1 border-line" />

          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </div>

      {/* Botón base en el Sidebar */}
      <button className="w-full flex items-center justify-start px-3 gap-3 h-12 text-main hover:bg-border-line/20 rounded-xl transition-colors overflow-hidden">
        <div className="w-8 h-8 rounded-full bg-background border border-line flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary transition-colors">
          <User className="w-5 h-5 text-muted" />
        </div>
        {!colapsado && (
          <div className="flex flex-col truncate text-left">
            <span className="font-semibold text-sm truncate">
              Hola, {user?.nombre || "Mi Perfil"}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
