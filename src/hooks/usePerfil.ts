// src/hooks/usePerfil.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  obtenerPerfil,
  actualizarPerfil,
  type Perfil,
  type PerfilParcial,
} from "@/lib/perfiles/perfilQueries";

export type EstadoGuardado = "inactivo" | "guardando" | "guardado" | "error";

/**
 * Fuente única del perfil para TODA la página de configuración.
 * Se instancia una vez (en el shell) y se pasa a las secciones, para que no
 * haya cinco lecturas ni estados desincronizados.
 *
 * Guardado optimista: el estado local se actualiza al instante y se revierte
 * si la BD rechaza el cambio.
 */
export function usePerfil(userId: string) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [estado, setEstado] = useState<EstadoGuardado>("inactivo");
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const { perfil: p, error } = await obtenerPerfil(userId);
    if (error) setErrorCarga(error);
    else setPerfil(p);
    setCargando(false);
  }, [userId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /**
   * Guarda un subconjunto de campos. Devuelve true si se guardó.
   * Cada sección llama a esto con lo suyo; nunca escribe la tabla directo.
   */
  const guardar = useCallback(
    async (cambios: PerfilParcial): Promise<boolean> => {
      if (!perfil) return false;

      const previo = perfil;
      setPerfil({ ...perfil, ...(cambios as Partial<Perfil>) });
      setEstado("guardando");
      setErrorGuardado(null);

      const { error } = await actualizarPerfil(userId, cambios);

      if (error) {
        setPerfil(previo); // revierte el optimismo
        setErrorGuardado(error);
        setEstado("error");
        return false;
      }

      setEstado("guardado");
      // El "Guardado ✓" se desvanece solo.
      setTimeout(
        () => setEstado((e) => (e === "guardado" ? "inactivo" : e)),
        2500,
      );
      return true;
    },
    [perfil, userId],
  );

  /** Refresca desde la BD (p. ej. tras cambiar la organización). */
  const refrescar = cargar;

  return {
    perfil,
    cargando,
    errorCarga,
    estado,
    errorGuardado,
    guardar,
    refrescar,
    setPerfilLocal: setPerfil,
  };
}
