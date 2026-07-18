// src/hooks/useFeedbackSnapshot.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PerfilSnapshot } from "@/lib/feedback/feedbackQueries";

const VACIO: PerfilSnapshot = {
  nombre: null,
  apellidos: null,
  pais: null,
  esMiembroAsd: null,
  division: null,
  union: null,
  campoLocal: null,
  distrito: null,
  iglesia: null,
  onboardingCompleto: false,
};

/**
 * Resuelve el snapshot del perfil para el widget cuando NO se lo pasan por prop
 * (navbars y sidebar, que son cliente).
 *
 * Si ya viene un snapshot listo (páginas server, p. ej. /feedback), se usa tal
 * cual y no se hace ninguna query. Si no, se carga una sola vez al montar.
 */
export function useFeedbackSnapshot(
  provisto: PerfilSnapshot | undefined,
  userId: string | null,
): PerfilSnapshot {
  const [snap, setSnap] = useState<PerfilSnapshot>(provisto ?? VACIO);

  useEffect(() => {
    if (provisto || !userId) return;

    let vivo = true;
    (async () => {
      const supabase = createClient();
      const { data: p } = await supabase
        .from("perfiles")
        .select(
          `nombre, apellidos, pais, es_miembro_asd, iglesia_libre, onboarding_completo,
           org_divisiones ( nombre ),
           org_uniones ( nombre ),
           org_campos_locales ( nombre ),
           org_distritos ( nombre ),
           org_iglesias ( nombre )`,
        )
        .eq("id", userId)
        .single();

      if (!vivo || !p) return;

      setSnap({
        nombre: p.nombre ?? null,
        apellidos: p.apellidos ?? null,
        pais: p.pais ?? null,
        esMiembroAsd: p.es_miembro_asd ?? null,
        division: (p as any).org_divisiones?.nombre ?? null,
        union: (p as any).org_uniones?.nombre ?? null,
        campoLocal: (p as any).org_campos_locales?.nombre ?? null,
        distrito: (p as any).org_distritos?.nombre ?? null,
        iglesia: (p as any).org_iglesias?.nombre ?? p.iglesia_libre ?? null,
        onboardingCompleto: Boolean(p.onboarding_completo),
      });
    })();

    return () => {
      vivo = false;
    };
  }, [provisto, userId]);

  return provisto ?? snap;
}
