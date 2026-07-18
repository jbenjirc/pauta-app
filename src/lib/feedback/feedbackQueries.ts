// src/lib/feedback/feedbackQueries.ts
// Capa de acceso a datos del feedback. Un solo lugar que toca la tabla.
import { createClient } from "@/lib/supabase/client";
import type { ContextoCliente } from "./contexto";

export type TipoFeedback = "error" | "idea" | "pregunta" | "general";

export const MAX_MENSAJE = 2000;
export const MAX_IMAGENES = 4;
export const MAX_IMAGEN_BYTES = 5 * 1024 * 1024; // 5 MB
export const TIPOS_IMAGEN = ["image/png", "image/jpeg", "image/webp"];

/** Snapshot del perfil que se congela junto al mensaje. */
export interface PerfilSnapshot {
  nombre: string | null;
  apellidos: string | null;
  pais: string | null;
  esMiembroAsd: boolean | null;
  division: string | null;
  union: string | null;
  campoLocal: string | null;
  distrito: string | null;
  iglesia: string | null;
  onboardingCompleto: boolean;
}

export interface NuevoFeedback {
  tipo: TipoFeedback;
  mensaje: string;
  imagenes: string[]; // rutas ya subidas al bucket 'feedback'
  ruta: string | null;
  idiomaApp: string;
  temaModo: string;
  tema: string;
  contexto: ContextoCliente;
  perfilSnapshot: PerfilSnapshot;
}

/**
 * Inserta un comentario. El usuario puede enviar los que quiera.
 * `usuario_id` se manda explícito y el RLS verifica que coincida con la
 * sesión (with check auth.uid() = usuario_id): no se puede suplantar a otro.
 */
export async function enviarFeedback(
  userId: string,
  datos: NuevoFeedback,
): Promise<{ error: string | null }> {
  const mensaje = datos.mensaje.trim();
  if (!mensaje) return { error: "vacio" };
  if (mensaje.length > MAX_MENSAJE) return { error: "muy-largo" };

  const supabase = createClient();

  const { error } = await supabase.from("feedback").insert({
    usuario_id: userId,
    tipo: datos.tipo,
    mensaje,
    imagenes: datos.imagenes,

    ruta: datos.ruta,
    user_agent: datos.contexto.userAgent,
    plataforma: datos.contexto.plataforma,
    idioma_navegador: datos.contexto.idiomaNavegador,
    zona_horaria: datos.contexto.zonaHoraria,
    viewport: datos.contexto.viewport,
    pantalla: datos.contexto.pantalla,
    app_version: datos.contexto.appVersion,

    idioma_app: datos.idiomaApp,
    tema_modo: datos.temaModo,
    tema: datos.tema,

    perfil_snapshot: datos.perfilSnapshot,
  });

  return { error: error ? error.message : null };
}

/** Historial propio (por si luego quieres mostrarle sus envíos). */
export async function obtenerMisFeedbacks(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("id, creado_en, tipo, mensaje, estado")
    .eq("usuario_id", userId)
    .order("creado_en", { ascending: false });

  return { feedbacks: data ?? [], error: error ? error.message : null };
}

// ============================================================================
//  Imágenes adjuntas (Supabase Storage, bucket privado 'feedback')
// ============================================================================

const BUCKET_FEEDBACK = "feedback";

/**
 * Sube una imagen adjunta y devuelve su RUTA dentro del bucket (no una URL:
 * el bucket es privado, tú generas signed URLs desde tu página de revisión).
 */
export async function subirImagenFeedback(
  userId: string,
  archivo: File,
): Promise<{ ruta: string | null; error: string | null }> {
  if (!TIPOS_IMAGEN.includes(archivo.type))
    return { ruta: null, error: "feedback.img-tipo" };
  if (archivo.size > MAX_IMAGEN_BYTES)
    return { ruta: null, error: "feedback.img-grande" };

  const supabase = createClient();
  const ext = archivo.type.split("/")[1].replace("jpeg", "jpg");
  const ruta = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_FEEDBACK)
    .upload(ruta, archivo, { contentType: archivo.type });

  if (error) return { ruta: null, error: error.message };
  return { ruta, error: null };
}
