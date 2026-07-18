// src/lib/perfiles/perfilQueries.ts
// Capa de acceso a datos del perfil. Un solo lugar para leer/escribir perfiles.
import { createClient } from "@/lib/supabase/client";

// Payload que produce el wizard de onboarding.
export interface DatosOnboarding {
  nombre: string;
  apellidos: string;
  esMiembroAsd: boolean;

  // Miembro ASD:
  divisionId?: string | null;
  unionId?: string | null;
  campoLocalId?: string | null;
  distritoId?: string | null;
  iglesiaId?: string | null;

  // Iglesia en texto libre: para NO-miembros, o para miembros cuya iglesia
  // aún no está en el árbol ("No aparece mi iglesia").
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
    es_miembro_asd: datos.esMiembroAsd,

    division_id: datos.esMiembroAsd ? (datos.divisionId ?? null) : null,
    union_id: datos.esMiembroAsd ? (datos.unionId ?? null) : null,
    campo_local_id: datos.esMiembroAsd ? (datos.campoLocalId ?? null) : null,
    distrito_id: datos.esMiembroAsd ? (datos.distritoId ?? null) : null,
    iglesia_id: datos.esMiembroAsd ? (datos.iglesiaId ?? null) : null,

    // iglesia_libre se usa tanto para NO-miembros como para miembros cuya
    // iglesia no está en el árbol (el hook decide cuándo mandarla; aquí solo
    // se normaliza).
    iglesia_libre: datos.iglesiaLibre?.trim() || null,

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

// ============================================================================
//  CONFIGURACIÓN · Lectura y edición del perfil
// ============================================================================

/**
 * Perfil completo tal como lo consume la página de configuración.
 * Los *_id son la fuente de verdad; los *Nombre vienen resueltos por el join
 * anidado de PostgREST (no hay vista: se apoya en las FK de las tablas org_*).
 */
export interface Perfil {
  id: string;
  nombre: string | null;
  apellidos: string | null;
  fotoUrl: string | null;
  pais: string | null;
  // Bio pública. Aún no se edita en Configuración; se lee para cuando exista
  // la pantalla de Perfil público (compartir escaletas).
  descripcion: string | null;

  esMiembroAsd: boolean | null;
  divisionId: string | null;
  unionId: string | null;
  campoLocalId: string | null;
  distritoId: string | null;
  iglesiaId: string | null;
  iglesiaLibre: string | null;

  // Nombres legibles (null si el *_id correspondiente es null).
  divisionNombre: string | null;
  unionNombre: string | null;
  campoLocalNombre: string | null;
  distritoNombre: string | null;
  iglesiaNombre: string | null;

  idiomaPreferente: string;
  temaModo: TemaModo;
  tema: string;
  onboardingCompleto: boolean;
}

export type TemaModo = "claro" | "oscuro" | "sistema";

/** Campos editables desde Configuración. Todo opcional: update parcial. */
export interface PerfilParcial {
  nombre?: string;
  apellidos?: string;
  fotoUrl?: string | null;
  pais?: string | null;
  descripcion?: string | null;

  esMiembroAsd?: boolean;
  divisionId?: string | null;
  unionId?: string | null;
  campoLocalId?: string | null;
  distritoId?: string | null;
  iglesiaId?: string | null;
  iglesiaLibre?: string | null;

  idiomaPreferente?: string;
  temaModo?: TemaModo;
  tema?: string;
}

// Join anidado: trae el nombre de cada nivel a partir de su FK.
// El alias `!perfiles_division_id_fkey` no hace falta mientras exista una sola
// FK por tabla; si algún día hay ambigüedad, PostgREST pedirá el nombre de la FK.
const SELECT_PERFIL = `
  id, nombre, apellidos, foto_url, pais, descripcion,
  es_miembro_asd, division_id, union_id, campo_local_id, distrito_id,
  iglesia_id, iglesia_libre, idioma_preferente, tema_modo, tema,
  onboarding_completo,
  org_divisiones ( nombre ),
  org_uniones ( nombre ),
  org_campos_locales ( nombre ),
  org_distritos ( nombre ),
  org_iglesias ( nombre )
`;

/** Normaliza la fila cruda (snake_case + joins) al tipo Perfil (camelCase). */
function mapearPerfil(f: any): Perfil {
  return {
    id: f.id,
    nombre: f.nombre,
    apellidos: f.apellidos,
    fotoUrl: f.foto_url,
    pais: f.pais,
    descripcion: f.descripcion,

    esMiembroAsd: f.es_miembro_asd,
    divisionId: f.division_id,
    unionId: f.union_id,
    campoLocalId: f.campo_local_id,
    distritoId: f.distrito_id,
    iglesiaId: f.iglesia_id,
    iglesiaLibre: f.iglesia_libre,

    divisionNombre: f.org_divisiones?.nombre ?? null,
    unionNombre: f.org_uniones?.nombre ?? null,
    campoLocalNombre: f.org_campos_locales?.nombre ?? null,
    distritoNombre: f.org_distritos?.nombre ?? null,
    iglesiaNombre: f.org_iglesias?.nombre ?? null,

    idiomaPreferente: f.idioma_preferente ?? "ES",
    temaModo: (f.tema_modo ?? "sistema") as TemaModo,
    tema: f.tema ?? "default",
    onboardingCompleto: Boolean(f.onboarding_completo),
  };
}

/** Lee el perfil completo del usuario. RLS garantiza que sólo sea el suyo. */
export async function obtenerPerfil(
  userId: string,
): Promise<{ perfil: Perfil | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("perfiles")
    .select(SELECT_PERFIL)
    .eq("id", userId)
    .single();

  if (error) return { perfil: null, error: error.message };
  return { perfil: mapearPerfil(data), error: null };
}

/**
 * Update PARCIAL: sólo escribe las claves presentes en `cambios`.
 * Así cada sección de Configuración guarda lo suyo sin pisar el resto.
 */
export async function actualizarPerfil(
  userId: string,
  cambios: PerfilParcial,
): Promise<{ error: string | null }> {
  const supabase = createClient();

  // Mapa camelCase -> snake_case. Sólo se incluye lo que venga definido.
  const mapa: Record<string, [string, unknown]> = {
    nombre: ["nombre", cambios.nombre?.trim()],
    apellidos: ["apellidos", cambios.apellidos?.trim()],
    fotoUrl: ["foto_url", cambios.fotoUrl],
    pais: ["pais", cambios.pais],
    descripcion: ["descripcion", cambios.descripcion?.trim() || null],
    esMiembroAsd: ["es_miembro_asd", cambios.esMiembroAsd],
    divisionId: ["division_id", cambios.divisionId],
    unionId: ["union_id", cambios.unionId],
    campoLocalId: ["campo_local_id", cambios.campoLocalId],
    distritoId: ["distrito_id", cambios.distritoId],
    iglesiaId: ["iglesia_id", cambios.iglesiaId],
    iglesiaLibre: ["iglesia_libre", cambios.iglesiaLibre?.trim() || null],
    idiomaPreferente: ["idioma_preferente", cambios.idiomaPreferente],
    temaModo: ["tema_modo", cambios.temaModo],
    tema: ["tema", cambios.tema],
  };

  const fila: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  for (const clave of Object.keys(cambios) as (keyof PerfilParcial)[]) {
    const entrada = mapa[clave];
    if (entrada && cambios[clave] !== undefined) {
      fila[entrada[0]] = entrada[1];
    }
  }

  const { error } = await supabase
    .from("perfiles")
    .update(fila)
    .eq("id", userId);
  return { error: error ? error.message : null };
}

// ============================================================================
//  Foto de perfil (Supabase Storage, bucket 'avatares')
// ============================================================================

const BUCKET_AVATARES = "avatares";
export const MAX_FOTO_BYTES = 2 * 1024 * 1024; // 2 MB
export const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];

/**
 * Sube/reemplaza la foto y devuelve su URL pública.
 * Ruta: {userId}/avatar.{ext}  -> la política de Storage exige que la primera
 * carpeta sea el uid del dueño.
 * NO escribe en perfiles: de eso se encarga quien llame (actualizarPerfil).
 */
export async function subirFotoPerfil(
  userId: string,
  archivo: File,
): Promise<{ url: string | null; error: string | null }> {
  if (!TIPOS_FOTO.includes(archivo.type)) {
    return { url: null, error: "tipo-invalido" };
  }
  if (archivo.size > MAX_FOTO_BYTES) {
    return { url: null, error: "muy-grande" };
  }

  const supabase = createClient();
  const ext = archivo.type.split("/")[1].replace("jpeg", "jpg");
  const ruta = `${userId}/avatar.${ext}`;

  const { error: errorSubida } = await supabase.storage
    .from(BUCKET_AVATARES)
    .upload(ruta, archivo, { upsert: true, contentType: archivo.type });

  if (errorSubida) return { url: null, error: errorSubida.message };

  const { data } = supabase.storage.from(BUCKET_AVATARES).getPublicUrl(ruta);

  // Cache-busting: la ruta es fija (upsert), así que sin esto el navegador
  // seguiría mostrando la foto anterior.
  return { url: `${data.publicUrl}?v=${Date.now()}`, error: null };
}

/** Borra la foto del Storage. Quien llame debe poner foto_url = null. */
export async function eliminarFotoPerfil(
  userId: string,
  urlActual: string | null,
): Promise<{ error: string | null }> {
  if (!urlActual) return { error: null };
  const supabase = createClient();

  // Deriva la ruta desde la URL pública (…/avatares/{uid}/avatar.ext?v=…)
  const sinQuery = urlActual.split("?")[0];
  const ruta = sinQuery.split(`/${BUCKET_AVATARES}/`)[1];
  if (!ruta) return { error: null };

  const { error } = await supabase.storage.from(BUCKET_AVATARES).remove([ruta]);
  return { error: error ? error.message : null };
}
