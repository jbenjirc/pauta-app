"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Plus, FileText, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [escaletas, setEscaletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creando, setCreando] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    cargarEscaletas();
  }, []);

  const cargarEscaletas = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/entrar");
        return;
      }

      // Traemos solo las escaletas del usuario ordenadas por edición reciente
      const { data, error } = await supabase
        .from("escaletas")
        .select("*")
        .order("ultima_edicion", { ascending: false });

      if (error) throw error;
      setEscaletas(data || []);
    } catch (error) {
      console.error("Error al cargar escaletas:", error);
    } finally {
      setLoading(false);
    }
  };

  const crearNuevaEscaleta = async () => {
    setCreando(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión no válida");

      // Insertamos una escaleta en blanco y pedimos que nos devuelva el ID
      const { data, error } = await supabase
        .from("escaletas")
        .insert({
          creador_id: user.id,
          titulo_programa: "Nueva Escaleta",
          es_plantilla: false,
          es_publico: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Redirigimos al editor dinámico con el nuevo UUID
      router.push(`/editor/${data.id}`);
    } catch (error) {
      console.error("Error al crear:", error);
      alert("Hubo un error al crear la escaleta.");
      setCreando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Escaletas</h1>
            <p className="text-gray-500 mt-1">
              Gestiona tus programas y tiempos en vivo
            </p>
          </div>
          <button
            onClick={crearNuevaEscaleta}
            disabled={creando}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 w-full sm:w-auto justify-center"
          >
            {creando ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {creando ? "Creando..." : "Nueva Escaleta"}
          </button>
        </div>

        {/* Estado Vacío vs Cuadrícula de Tarjetas */}
        {escaletas.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes escaletas aún
            </h3>
            <p className="text-gray-500 mb-6">
              Crea tu primer programa para empezar a organizar los tiempos en
              cabina.
            </p>
            <button
              onClick={crearNuevaEscaleta}
              disabled={creando}
              className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
            >
              Crear mi primera escaleta &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {escaletas.map((escaleta) => (
              <Link href={`/editor/${escaleta.id}`} key={escaleta.id}>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-orange-400 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2 truncate">
                      {escaleta.titulo_programa || "Sin título"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {escaleta.nombre_iglesia || "Sin iglesia asignada"}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                    <span>
                      Editado:{" "}
                      {new Date(escaleta.ultima_edicion).toLocaleDateString()}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                      Borrador
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
