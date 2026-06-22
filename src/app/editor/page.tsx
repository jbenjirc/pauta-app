"use client";

import { useState, useEffect } from "react";
import { Clock, FileDown, CloudUpload } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Bloque } from "@/lib/types";
import { calcularTiemposEscaleta } from "@/lib/timeEngine";
import EscaletaTable from "@/components/editor/EscaletaTable";
import EscaletaPDF from "@/components/editor/EscaletaPDF";
import { createClient } from "@/lib/supabase"; // <-- Importamos Supabase

export default function EditorPage() {
  const [horaInicio, setHoraInicio] = useState("07:30");
  const [isMounted, setIsMounted] = useState(false);
  const [guardando, setGuardando] = useState(false); // Estado para el botón de carga

  // Instanciamos el cliente de Supabase
  const supabase = createClient();

  const [bloques, setBloques] = useState<Bloque[]>([
    {
      id: "1",
      duracion: 6,
      actividad: "Serv. Canto",
      participante: "Blanca Suzel",
      recursos: "Himno Núm. 171\nHimno Núm. 292",
    },
    {
      id: "2",
      duracion: 3,
      actividad: "Bienvenida",
      participante: "Juan Carlos",
      recursos: "",
    },
    {
      id: "3",
      duracion: 4,
      actividad: "Lec. bíblica",
      participante: "Yadira González",
      recursos: "1 Corintios 1:18",
    },
    {
      id: "4",
      duracion: 3,
      actividad: "Oración",
      participante: "Yadira González",
      recursos: "",
    },
    {
      id: "5",
      duracion: 4,
      actividad: "Himno",
      participante: "Blanca Suzel",
      recursos: "Himno Núm. 149",
    },
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const bloquesCalculados = calcularTiemposEscaleta(horaInicio, bloques);

  const actualizarBloque = (id: string, campo: keyof Bloque, valor: any) => {
    setBloques(
      bloques.map((b) => (b.id === id ? { ...b, [campo]: valor } : b)),
    );
  };

  const agregarBloque = () => {
    const nuevoId = Math.random().toString(36).substring(2, 9);
    setBloques([
      ...bloques,
      {
        id: nuevoId,
        duracion: 5,
        actividad: "",
        participante: "",
        recursos: "",
      },
    ]);
  };

  const eliminarBloque = (id: string) => {
    setBloques(bloques.filter((b) => b.id !== id));
  };

  // --- LÓGICA PARA GUARDAR EN SUPABASE ---
  const guardarEnNube = async () => {
    setGuardando(true);
    try {
      // 1. Guardamos la información general en la tabla 'escaletas'
      const { data: escaletaGuardada, error: errorEscaleta } = await supabase
        .from("escaletas")
        .insert([{ hora_inicio: horaInicio }])
        .select()
        .single();

      if (errorEscaleta) throw errorEscaleta;

      // 2. Preparamos los bloques asociándolos al ID de la escaleta recién creada
      const bloquesParaGuardar = bloques.map((bloque, index) => ({
        escaleta_id: escaletaGuardada.id,
        orden: index, // Guardamos el orden para que no se desordenen al cargar
        duracion: bloque.duracion,
        actividad: bloque.actividad,
        participante: bloque.participante,
        recursos: bloque.recursos,
      }));

      // 3. Insertamos todos los bloques de golpe en la tabla 'bloques'
      const { error: errorBloques } = await supabase
        .from("bloques")
        .insert(bloquesParaGuardar);

      if (errorBloques) throw errorBloques;

      alert("¡Escaleta guardada exitosamente en la nube!");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar la escaleta.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Programa Culto Media Semana
            </h1>
            <p className="text-sm text-gray-500">
              Iglesia Adventista Iglesia Central
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Botón de Guardar en Supabase */}
            <button
              onClick={guardarEnNube}
              disabled={guardando}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <CloudUpload className="w-4 h-4" />
              {guardando ? "Guardando..." : "Guardar en la nube"}
            </button>

            {isMounted && (
              <PDFDownloadLink
                document={
                  <EscaletaPDF
                    horaInicio={horaInicio}
                    bloques={bloquesCalculados}
                  />
                }
                fileName={`escaleta-${horaInicio.replace(":", "-")}.pdf`}
              >
                {/* @ts-ignore */}
                {({ loading }) => (
                  <button
                    disabled={loading}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                  >
                    <FileDown className="w-4 h-4" />
                    {loading ? "Generando..." : "Descargar PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            )}

            <div className="flex items-center gap-4 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 ml-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-orange-800 uppercase tracking-wider">
                  Inicio
                </label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="bg-transparent border-none p-0 text-base font-bold text-orange-900 focus:ring-0 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <EscaletaTable
          bloques={bloquesCalculados}
          actualizarBloque={actualizarBloque}
          agregarBloque={agregarBloque}
          eliminarBloque={eliminarBloque}
        />
      </div>
    </div>
  );
}
