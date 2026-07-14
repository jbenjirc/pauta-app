// src/lib/perfiles/perfilQueries.ts
// Capa de acceso a datos del perfil. Un solo lugar para leer/escribir perfiles.
import { createClient } from "@/lib/supabase/client";

// Payload que produce el wizard de onboarding.
export interface DatosOnboarding {
  nombre: string;
  apellidos: string;
  campoPerfil?: string | null;
  esMiembroAsd: boolean;

  // Miembro ASD:
  divisionId?: string | null;
  unionId?: string | null;
  campoLocalId?: string | null;
  distritoId?: string | null;
  iglesiaId?: string | null;

  // No miembro:
  iglesiaLibre?: string | null;

  // Derivados / preferencias:
  pais?: string | null;
  idiomaPreferente: string;
}

/**
 * Guarda el onboarding en la fila del perfil (que ya existe por el trigger de
 * la BD) y marca onboarding_completo = true. Devuelve error legible o null.
 */
export async function guardarOnboarding(
  userId: string,
  datos: DatosOnboarding,
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const fila = {
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    campo_perfil: datos.campoPerfil?.trim() || null,
    es_miembro_asd: datos.esMiembroAsd,

    division_id: datos.esMiembroAsd ? (datos.divisionId ?? null) : null,
    union_id: datos.esMiembroAsd ? (datos.unionId ?? null) : null,
    campo_local_id: datos.esMiembroAsd ? (datos.campoLocalId ?? null) : null,
    distrito_id: datos.esMiembroAsd ? (datos.distritoId ?? null) : null,
    iglesia_id: datos.esMiembroAsd ? (datos.iglesiaId ?? null) : null,

    iglesia_libre: !datos.esMiembroAsd
      ? datos.iglesiaLibre?.trim() || null
      : null,

    pais: datos.pais ?? null,
    idioma_preferente: datos.idiomaPreferente,
    onboarding_completo: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("perfiles")
    .update(fila)
    .eq("id", userId);

  if (error) return { error: error.message };
  return { error: null };
}

/** Consulta rápida para guards: ¿ya completó el onboarding? */
export async function onboardingCompleto(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("perfiles")
    .select("onboarding_completo")
    .eq("id", userId)
    .single();
  return Boolean(data?.onboarding_completo);
}
