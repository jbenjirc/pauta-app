import { useEffect, useRef } from "react";

export function useAutoSave({
  supabase,
  escaleta,
  bloques,
  setEscaleta,
  intervaloMs = 300000, // 5 minutos por defecto
}: {
  supabase: any;
  escaleta: any;
  bloques: any[];
  setEscaleta: any;
  intervaloMs?: number;
}) {
  // Usamos referencias para guardar la versión más reciente de los datos
  // sin reiniciar el temporizador en cada pulsación de tecla.
  const escaletaRef = useRef(escaleta);
  const bloquesRef = useRef(bloques);

  // Mantenemos las referencias actualizadas
  useEffect(() => {
    escaletaRef.current = escaleta;
    bloquesRef.current = bloques;
  }, [escaleta, bloques]);

  useEffect(() => {
    // Si no hay escaleta cargada, no iniciamos el temporizador
    if (!escaletaRef.current?.id) return;

    const autoGuardar = async () => {
      const dataEscaleta = escaletaRef.current;
      const dataBloques = bloquesRef.current;

      console.log("⏱️ Iniciando auto-guardado automático...");
      try {
        // 1. Guardar Cabecera
        const { error: errorCabecera } = await supabase
          .from("escaletas")
          .update({
            titulo_programa: dataEscaleta.titulo_programa,
            nombre_iglesia: dataEscaleta.nombre_iglesia,
            fecha_programa: dataEscaleta.fecha_programa,
            hora_inicio_programa: dataEscaleta.hora_inicio_programa,
            color_escaleta: dataEscaleta.color_escaleta,
            ultima_edicion: new Date().toISOString(),
          })
          .eq("id", dataEscaleta.id);

        if (errorCabecera) throw errorCabecera;

        // 2. Guardar Bloques
        const bloquesParaBD = dataBloques.map((b) => ({
          id: b.id,
          escaleta_id: b.escaleta_id,
          orden: b.orden,
          duracion_minutos: b.duracion,
          actividad: b.actividad,
          participante: b.participante,
          responsable_tecnico: b.responsable_tecnico,
          recursos_drive_url: b.recursos_drive_url,
          descripcion_indicaciones: b.recursos,
          comentarios_cabina: b.comentarios_cabina,
        }));

        if (bloquesParaBD.length > 0) {
          const { error: errorBloques } = await supabase
            .from("bloques")
            .upsert(bloquesParaBD);

          if (errorBloques) throw errorBloques;
        }

        console.log("✅ Auto-guardado completado con éxito.");

        // Actualizamos la interfaz sutilmente
        setEscaleta((prev: any) => ({
          ...prev,
          ultima_edicion: new Date().toISOString(),
        }));
      } catch (error) {
        console.error("❌ Error en el auto-guardado automático:", error);
      }
    };

    // Iniciamos el ciclo
    const interval = setInterval(autoGuardar, intervaloMs);

    // Limpiamos el intervalo al desmontar la vista
    return () => clearInterval(interval);
  }, [supabase, setEscaleta, intervaloMs]);
  // Nota: Al no depender de 'escaleta' ni 'bloques' aquí, el temporizador es ininterrumpible.
}
