import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditorClient from "./EditorClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditorPage({ params }: PageProps) {
  // 1. Desestructuración asíncrona de params (Estándar obligatorio para Next.js 15/16)
  const { slug } = await params;

  // 2. Inicialización del cliente de Supabase optimizado para Server Components (SSR)
  const supabase = createClient();

  // 3. Fetching de la cabecera (Escaleta)
  const { data: escaletaData, error: escaletaError } = await supabase
    .from("escaletas")
    .select("*")
    .eq("slug", slug)
    .single();

  // Si la plantilla/escaleta no existe o el usuario no tiene permisos,
  // se ejecuta un cortocircuito seguro redirigiendo al inicio.
  if (escaletaError || !escaletaData) {
    redirect("/inicio");
  }

  // 4. Fetching de los bloques asociados de forma secuencial y optimizada
  const { data: bloquesData, error: bloquesError } = await supabase
    .from("bloques")
    .select("*")
    .eq("escaleta_id", escaletaData.id)
    .order("orden", { ascending: true });

  if (bloquesError) {
    // Registramos el error en los logs del servidor para auditoría sin romper la UI
    console.error(
      "⚠️ Error crítico recuperando bloques de escaleta:",
      bloquesError,
    );
  }

  // 5. Mapeo estructural de datos en el Servidor (Evita procesamiento costoso en el cliente)
  const initialBloques = (bloquesData || []).map((b) => ({
    id: b.id,
    escaleta_id: b.escaleta_id,
    orden: b.orden,
    duracion: b.duracion_minutos || 0,
    actividad: b.actividad || "",
    participante: b.participante || "",
    responsable_tecnico: b.responsable_tecnico || "",
    recursos_drive_url: b.recursos_drive_url || "",
    comentarios_cabina: b.comentarios_cabina || "",
    notas_bloque: b.notas_bloque || "",
    es_nuevo: false,
  }));

  // 6. Renderizado e inyección de propiedades hidratadas al cliente interactivo
  return (
    <EditorClient
      initialEscaleta={escaletaData}
      initialBloques={initialBloques}
    />
  );
}
