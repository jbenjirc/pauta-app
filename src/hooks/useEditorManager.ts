// hooks/useEditorManager.ts
import { useState } from "react";
import { createClient } from "@/lib/supabase"; // Cliente de navegador
import { useRouter } from "next/navigation";
import { Bloque } from "@/lib/types";
import { useEditorContext } from "@/contextos/EditorContext";

export function useEditorManager(initialEscaleta: any, initialBloques: any[]) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [escaleta, setEscaleta] = useState<any>(initialEscaleta);
  const [bloques, setBloques] = useState<any[]>(initialBloques);

  const { setGuardando, setUltimaEdicion } = useEditorContext();

  const agregarBloque = () => {
    setBloques((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        escaleta_id: escaleta.id,
        orden: prev.length + 1,
        duracion: 5,
        actividad: "",
        participante: "",
        descripcion_indicaciones: "",
        es_nuevo: true,
      },
    ]);
  };

  const actualizarBloque = (id: string, campo: keyof Bloque, valor: any) => {
    setBloques((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [campo]: valor } : b)),
    );
  };

  const eliminarBloque = async (id: string) => {
    const bloqueAEliminar = bloques.find((b) => b.id === id);
    if (!bloqueAEliminar) return;

    // Actualización optimista en la UI
    setBloques((prev) =>
      prev
        .filter((b) => b.id !== id)
        .map((b, index) => ({ ...b, orden: index + 1 })),
    );

    if (!bloqueAEliminar.es_nuevo) {
      await supabase.from("bloques").delete().eq("id", id);
    }
  };

  const guardarCambios = async (redirigir = false) => {
    setGuardando(true);
    try {
      const fechaActualizacion = new Date().toISOString();

      const { error: errorCabecera } = await supabase
        .from("escaletas")
        .update({
          titulo_programa: escaleta.titulo_programa,
          nombre_iglesia: escaleta.nombre_iglesia,
          fecha_programa: escaleta.fecha_programa,
          hora_inicio_programa: escaleta.hora_inicio_programa,
          color_escaleta: escaleta.color_escaleta,
          ultima_edicion: fechaActualizacion,
        })
        .eq("id", escaleta.id);

      if (errorCabecera) throw errorCabecera;

      const bloquesParaBD = bloques.map((b) => ({
        id: b.id,
        escaleta_id: b.escaleta_id,
        orden: b.orden,
        duracion_minutos: b.duracion,
        actividad: b.actividad,
        participante: b.participante,
        responsable_tecnico: b.responsable_tecnico,
        recursos_drive_url: b.recursos_drive_url,
        descripcion_indicaciones: b.descripcion_indicaciones,
        comentarios_cabina: b.comentarios_cabina,
      }));

      if (bloquesParaBD.length > 0) {
        const { error: errorBloques } = await supabase
          .from("bloques")
          .upsert(bloquesParaBD);

        if (errorBloques) throw errorBloques;
      }

      setUltimaEdicion(fechaActualizacion);

      if (redirigir) {
        router.push("/inicio");
      } else {
        alert("¡Cambios guardados con éxito!");
      }
    } catch (error: any) {
      console.error("❌ Error en Supabase:", error);
      alert(`Hubo un error al guardar: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  // Puedes añadir aquí también guardarAvanzados() siguiendo la misma lógica

  return {
    escaleta,
    setEscaleta,
    bloques,
    agregarBloque,
    actualizarBloque,
    eliminarBloque,
    guardarCambios,
  };
}
