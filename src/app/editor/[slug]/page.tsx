"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  ArrowLeft,
  Save,
  Loader2,
  Clock,
  Calendar,
  Palette,
  Building,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";

// Componentes importados
import { calcularTiemposEscaleta } from "@/lib/timeEngine";
import EscaletaTable from "@/components/editor/EscaletaTable";
import EscaletaPDF from "@/components/editor/EscaletaPDF";
import { Bloque } from "@/lib/types";

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

      // Traducimos columnas BD -> Variables de tu Componente
      const bloquesMapeados = (bloquesData || []).map((b) => ({
        id: b.id,
        escaleta_id: b.escaleta_id,
        orden: b.orden,
        duracion: b.duracion_minutos || 0,
        actividad: b.actividad || "",
        participante: b.participante || "",
        recursos: b.descripcion_indicaciones || "", // Mapeo a "recursos"
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
        recursos: "",
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

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      await supabase
        .from("escaletas")
        .update({
          titulo_programa: escaleta.titulo_programa,
          nombre_iglesia: escaleta.nombre_iglesia,
          fecha_programa: escaleta.fecha_programa,
          color_escaleta: escaleta.color_escaleta,
          hora_inicio_programa: escaleta.hora_inicio_programa,
          ultima_edicion: new Date().toISOString(),
        })
        .eq("id", escaleta.id);

      // Traducimos Variables de tu Componente -> Columnas BD
      const bloquesParaBD = bloques.map((b) => ({
        id: b.id,
        escaleta_id: b.escaleta_id,
        orden: b.orden,
        duracion_minutos: b.duracion,
        actividad: b.actividad,
        participante: b.participante,
        descripcion_indicaciones: b.recursos, // Guardamos como "descripcion_indicaciones"
      }));

      if (bloquesParaBD.length > 0) {
        await supabase.from("bloques").upsert(bloquesParaBD);
      }

      alert("¡Cambios guardados con éxito!");
      cargarDatos();
    } catch (error) {
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setGuardando(false);
    }
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
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />{" "}
          <span className="font-medium hidden sm:inline">Volver</span>
        </Link>

        <div className="flex items-center gap-3">
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
            onClick={guardarCambios}
            disabled={guardando}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50"
          >
            {guardando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* PANEL GENERAL */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Programa
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                value={escaleta.titulo_programa || ""}
                onChange={(e) =>
                  setEscaleta({ ...escaleta, titulo_programa: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Building className="w-4 h-4" /> Iglesia
              </label>
              <input
                type="text"
                placeholder="Ej. Central"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={escaleta.nombre_iglesia || ""}
                onChange={(e) =>
                  setEscaleta({ ...escaleta, nombre_iglesia: e.target.value })
                }
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Inicio
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  value={escaleta.hora_inicio_programa || ""}
                  onChange={(e) =>
                    setEscaleta({
                      ...escaleta,
                      hora_inicio_programa: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Fecha
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  value={escaleta.fecha_programa || ""}
                  onChange={(e) =>
                    setEscaleta({ ...escaleta, fecha_programa: e.target.value })
                  }
                />
              </div>
              <div className="w-16">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Palette className="w-4 h-4" />
                </label>
                <input
                  type="color"
                  className="w-full h-[42px] p-1 border border-gray-300 rounded-lg cursor-pointer"
                  value={escaleta.color_escaleta || "#EA580C"}
                  onChange={(e) =>
                    setEscaleta({ ...escaleta, color_escaleta: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* TABLA MODULAR */}
        <EscaletaTable
          bloques={bloquesConTiempos}
          actualizarBloque={actualizarBloque}
          eliminarBloque={eliminarBloque}
          agregarBloque={agregarBloque}
        />
      </div>
    </div>
  );
}
