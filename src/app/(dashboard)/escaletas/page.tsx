"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Plus, Loader2 } from "lucide-react";
import EscaletasGrid from "@/components/ui/EscaletasGrid";
import ModalCrearEscaleta from "@/components/modals/ModalCrearEscaleta";
import ModalVerEscaleta from "@/components/modals/ModalVerEscaleta";

export default function DashboardPage() {
  const [escaletas, setEscaletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creando, setCreando] = useState(false);

  // Estados para los modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Estado del formulario (Ahora incluye la fecha por defecto de hoy)
  const [nuevoPrograma, setNuevoPrograma] = useState({
    titulo: "",
    color: "#EA580C",
    horaInicio: "10:00",
    fecha: new Date().toISOString().split("T")[0],
  });

  const router = useRouter();
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    cargarEscaletas();
  }, []);

  const cargarEscaletas = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/entrar");

      const { data, error } = await supabase
        .from("escaletas")
        .select("*")
        .order("ultima_edicion", { ascending: false });

      if (error) throw error;
      setEscaletas(data || []);
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setLoading(false);
    }
  };

  const generarSlug = (texto: string) => {
    const base = texto
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-");
    return `${base}-${Math.random().toString(36).substring(2, 6)}`;
  };

  const guardarNuevaEscaleta = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreando(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión no válida");

      const slugGenerado = generarSlug(nuevoPrograma.titulo);

      const { data, error } = await supabase
        .from("escaletas")
        .insert({
          creador_id: user.id,
          titulo_programa: nuevoPrograma.titulo,
          color_escaleta: nuevoPrograma.color,
          hora_inicio_programa: nuevoPrograma.horaInicio,
          fecha_programa: nuevoPrograma.fecha,
          slug: slugGenerado,
          estado: "activa",
          favorito: false,
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/editor/${data.slug}`);
    } catch (error) {
      console.error("Error al crear:", error);
      alert("Error al crear la escaleta.");
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
    <div className="min-h-screen bg-gray-50 p-8 font-sans relative">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Escaletas</h1>
            <p className="text-gray-500 mt-1">
              Gestiona tus programas y tiempos en vivo
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> Nueva Escaleta
          </button>
        </div>

        {/* Grid de Tarjetas */}
        <EscaletasGrid
          escaletas={escaletas}
          onCardClick={(escaleta) => setPreviewData(escaleta)}
          onCrearClick={() => setIsCreateOpen(true)}
        />
      </div>

      {/* Modales Inyectados */}
      <ModalCrearEscaleta
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={guardarNuevaEscaleta}
        creando={creando}
        formData={nuevoPrograma}
        setFormData={setNuevoPrograma}
      />

      <ModalVerEscaleta
        isOpen={!!previewData}
        onClose={() => setPreviewData(null)}
        escaleta={previewData}
      />
    </div>
  );
}
