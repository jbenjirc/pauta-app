"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  ArrowLeft,
  Loader2,
  FileDown,
  CloudUpload,
  CloudSync,
} from "lucide-react";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";
// import { useAutoSave } from "@/lib/useAutoSave";

// Componentes importados
import { calcularTiemposEscaleta } from "@/lib/timeEngine";
import EscaletaTable from "@/components/editor/EscaletaTable";
import EscaletaPDF from "@/components/editor/EscaletaPDF";
import { Bloque } from "@/lib/types";
import PanelControl from "@/components/editor/PanelControl";
import ControlesAvanzadosSidebar from "@/components/editor/ControlesAvanzadosSidebar";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [supabase] = useState(() => createClient());

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [escaleta, setEscaleta] = useState<any>(null);
  const [bloques, setBloques] = useState<any[]>([]);

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // useAutoSave({
  //   supabase,
  //   escaleta,
  //   bloques,
  //   setEscaleta,
  //  intervaloMs: 300000, // 5 minutos});

  useEffect(() => {
    setIsMounted(true);
    if (slug) cargarDatos();
  }, [slug]);

  const cargarDatos = async () => {
    try {
      const { data: escaletaData, error: escaletaError } = await supabase
        .from("escaletas")
        .select("*")
        .eq("slug", slug)
        .single();

      if (escaletaError || !escaletaData) return router.push("/dashboard");
      setEscaleta(escaletaData);

      const { data: bloquesData, error: bloquesError } = await supabase
        .from("bloques")
        .select("*")
        .eq("escaleta_id", escaletaData.id)
        .order("orden", { ascending: true });

      if (bloquesError) throw bloquesError;

      const bloquesMapeados = (bloquesData || []).map((b) => ({
        id: b.id,
        escaleta_id: b.escaleta_id,
        orden: b.orden,
        duracion: b.duracion_minutos || 0,
        actividad: b.actividad || "",
        participante: b.participante || "",
        responsable_tecnico: b.responsable_tecnico || "",
        recursos_drive_url: b.recursos_drive_url || "",
        descripcion_indicaciones: b.descripcion_indicaciones || "",
        comentarios_cabina: b.comentarios_cabina || "",
        es_nuevo: false,
      }));
      setBloques(bloquesMapeados);
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarBloque = () => {
    setBloques([
      ...bloques,
      {
        id: crypto.randomUUID(),
        escaleta_id: escaleta.id,
        orden: bloques.length + 1,
        duracion: 5,
        actividad: "",
        participante: "",
        descripcion_indicaciones: "",
        es_nuevo: true,
      },
    ]);
  };

  const actualizarBloque = (id: string, campo: keyof Bloque, valor: any) => {
    setBloques(
      bloques.map((b) => (b.id === id ? { ...b, [campo]: valor } : b)),
    );
  };

  const eliminarBloque = async (id: string) => {
    const bloqueAEliminar = bloques.find((b) => b.id === id);
    if (!bloqueAEliminar) return;

    if (!bloqueAEliminar.es_nuevo) {
      await supabase.from("bloques").delete().eq("id", id);
    }
    setBloques(
      bloques
        .filter((b) => b.id !== id)
        .map((b, index) => ({ ...b, orden: index + 1 })),
    );
  };

  const guardarCambios = async (redirigir = false) => {
    setGuardando(true);
    try {
      // 1. Guardar la información general de la escaleta (Cabecera) y capturar su error
      const { error: errorCabecera } = await supabase
        .from("escaletas")
        .update({
          titulo_programa: escaleta.titulo_programa,
          nombre_iglesia: escaleta.nombre_iglesia,
          fecha_programa: escaleta.fecha_programa,
          hora_inicio_programa: escaleta.hora_inicio_programa,
          color_escaleta: escaleta.color_escaleta,

          ultima_edicion: new Date().toISOString(),
        })
        .eq("id", escaleta.id);

      // Si la base de datos rechazó la cabecera, detenemos todo aquí
      if (errorCabecera) throw errorCabecera;

      // 2. Traducimos Variables de tu Componente -> Columnas BD
      const bloquesParaBD = bloques.map((b) => ({
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
        // Capturamos el error del upsert de los bloques
        const { error: errorBloques } = await supabase
          .from("bloques")
          .upsert(bloquesParaBD);

        // Si falló el guardado de las filas, detenemos todo aquí
        if (errorBloques) throw errorBloques;
      }

      if (redirigir) {
        router.push("/dashboard");
      } else {
        alert("¡Cambios guardados con éxito!");
        cargarDatos();
        setGuardando(false);
      }
    } catch (error: any) {
      // Este bloque ahora sí se va a activar y te dirá la verdad en la consola
      console.error("❌ Error real detectado en Supabase:", error);
      alert(
        `Hubo un error al guardar: ${error.message || "Revisa la consola para más detalles."}`,
      );
      setGuardando(false);
    }
  };

  const guardarAvanzados = async () => {
    setGuardando(true);
    try {
      // 1. Guardar solo la información de ajustes (Cabecera)
      const { error: errorCabecera } = await supabase
        .from("escaletas")
        .update({
          // Campos del panel avanzado
          hora_inicio_stream: escaleta.hora_inicio_stream,
          floor_manager: escaleta.floor_manager,
          director_tecnico: escaleta.director_tecnico,
          mostrar_col_responsable: escaleta.mostrar_col_responsable,
          mostrar_col_recursos: escaleta.mostrar_col_recursos,
          mostrar_col_comentarios: escaleta.mostrar_col_comentarios,

          ultima_edicion: new Date().toISOString(),
        })
        .eq("id", escaleta.id);

      if (errorCabecera) throw errorCabecera;

      alert("¡Configuración avanzada guardada con éxito!");
      cargarDatos();
    } catch (error: any) {
      console.error(
        "❌ Error real detectado en Supabase (Ajustes Avanzados):",
        error,
      );
      alert(
        `Hubo un error al guardar los ajustes avanzados: ${error.message || "Revisa la consola."}`,
      );
    } finally {
      setGuardando(false);
    }
  };

  const calcularTiempoTranscurrido = (fechaString: string | null) => {
    if (!fechaString) return "N/A";

    const fecha = new Date(fechaString).getTime();
    const ahora = new Date().getTime();
    const segundos = Math.floor((ahora - fecha) / 1000);

    if (segundos < 60) return "unos segundos";

    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `${minutos} minuto${minutos !== 1 ? "s" : ""}`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `${horas} hora${horas !== 1 ? "s" : ""}`;

    const dias = Math.floor(horas / 24);
    return `${dias} día${dias !== 1 ? "s" : ""}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-600 w-8 h-8" />
      </div>
    );

  // Calculamos los tiempos usando tu motor
  const bloquesConTiempos = calcularTiemposEscaleta(
    escaleta?.hora_inicio_programa || "00:00",
    bloques,
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
        <button
          onClick={() => guardarCambios(true)}
          disabled={guardando}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          {guardando ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowLeft className="w-5 h-5" />
          )}
          <span className="font-medium hidden sm:inline">
            {guardando ? "Saliendo..." : "Volver"}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <CloudSync className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm italic">
              Guardado hace{" "}
              {calcularTiempoTranscurrido(escaleta?.ultima_edicion)}
            </span>
          </div>
          {isMounted && (
            <PDFDownloadLink
              document={
                <EscaletaPDF escaleta={escaleta} bloques={bloquesConTiempos} />
              }
              fileName={`Escaleta-${escaleta?.slug || "programa"}.pdf`}
              className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium shadow-sm"
            >
              {/* @ts-ignore */}
              {({ loading }) => (
                <>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {loading ? "Generando..." : "Descargar PDF"}
                  </span>
                </>
              )}
            </PDFDownloadLink>
          )}

          <button
            onClick={() => guardarCambios()}
            disabled={guardando}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50"
          >
            {guardando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CloudUpload className="w-4 h-4" />
            )}
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      <div className="max-w-10xl mx-auto px-6 mt-8">
        {/* CONTROL DE LA ESCALETA */}
        <PanelControl
          escaleta={escaleta}
          setEscaleta={setEscaleta}
          onOpenAdvancedControls={() => setIsAdvancedOpen(true)}
        />
        {/* TABLA */}
        <EscaletaTable
          bloques={bloquesConTiempos}
          colorPrincipal={escaleta?.color_escaleta}
          // Pasamos los booleanos de configuración en vivo
          mostrarResponsable={escaleta?.mostrar_col_responsable}
          mostrarRecursos={escaleta?.mostrar_col_recursos}
          mostrarComentarios={escaleta?.mostrar_col_comentarios}
          actualizarBloque={actualizarBloque}
          eliminarBloque={eliminarBloque}
          agregarBloque={agregarBloque}
        />
      </div>
      {/* SIDEBAR DE CONTROLES AVANZADOS */}
      <ControlesAvanzadosSidebar
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        avanzados={escaleta}
        setAvanzados={setEscaleta}
        onGuardarAvanzados={guardarAvanzados}
        guardando={guardando}
      />
    </div>
  );
}
