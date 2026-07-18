// src/lib/org/orgQueries.ts
// Capa de acceso a datos de la organización ASD (info_asd_org).
// Toda consulta a Supabase de la jerarquía vive AQUÍ. Los componentes/hooks
// nunca hablan directo con la BD: piden a estas funciones. Esto permite
// cambiar el backend o cachear sin tocar la UI.
import { createClient } from "@/lib/supabase/client";

// --- Tipos compartidos ------------------------------------------------------
export interface NodoOrg {
  id: string;
  nombre: string;
}

export type NivelOrg =
  | "division"
  | "union"
  | "campo_local"
  | "distrito"
  | "iglesia";

// --- Consultas en cascada ---------------------------------------------------
// Cada función devuelve los hijos de un nodo, ordenados para el dropdown.

export async function obtenerDivisiones(): Promise<NodoOrg[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("org_divisiones")
    .select("id, nombre")
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function obtenerUniones(divisionId: string): Promise<NodoOrg[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("org_uniones")
    .select("id, nombre")
    .eq("division_id", divisionId)
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function obtenerCamposLocales(
  unionId: string,
): Promise<NodoOrg[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("org_campos_locales")
    .select("id, nombre")
    .eq("union_id", unionId)
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function obtenerDistritos(
  campoLocalId: string,
): Promise<NodoOrg[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("org_distritos")
    .select("id, nombre")
    .eq("campo_local_id", campoLocalId)
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function obtenerIglesias(distritoId: string): Promise<NodoOrg[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("org_iglesias")
    .select("id, nombre")
    .eq("distrito_id", distritoId)
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** País (ISO-2) asociado a un campo local. Se usa para derivar perfil.pais. */
export async function obtenerPaisDeCampoLocal(
  campoLocalId: string,
): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("org_campos_locales")
    .select("pais")
    .eq("id", campoLocalId)
    .single();
  if (error) throw error;
  return data?.pais ?? null;
}
