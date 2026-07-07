// components/layout/UserNavbarMenu.tsx
"use client";

import Link from "next/link";
import { User, List, LogOut } from "lucide-react";
import { useSession } from "@/contextos/SessionContext";

export default function UserNavbarMenu() {
  const { user, logout } = useSession();

  return (
    <div className="relative group">
      {/* Menú desplegable (hacia abajo) */}
      <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-line rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        <div className="flex flex-col p-1">
          <Link
            href="/perfil"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-main hover:bg-border-line/30 rounded-lg transition-colors"
          >
            <User className="w-4 h-4 text-muted" />
            Perfil
          </Link>

          <Link
            href="/escaletas"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-main hover:bg-border-line/30 rounded-lg transition-colors"
          >
            <List className="w-4 h-4 text-muted" />
            Mis escaletas
          </Link>

          <hr className="my-1 border-line" />

          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Botón base en el Navbar */}
      <button className="flex items-center gap-2 h-10 px-2 text-main hover:bg-border-line/20 rounded-xl transition-colors">
        <span className="font-medium text-sm hidden sm:block truncate max-w-[120px]">
          Hola, {user?.nombre || "Usuario"}
        </span>
        <div className="w-8 h-8 rounded-full bg-background border border-line flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary transition-colors">
          <User className="w-4 h-4 text-muted" />
        </div>
      </button>
    </div>
  );
}
