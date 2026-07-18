"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Loader2 } from "lucide-react";
import EscaletasGrid from "@/components/ui/EscaletasGrid";
import ModalCrearEscaleta from "@/components/modals/ModalCrearEscaleta";
import ModalVerEscaleta from "@/components/modals/ModalVerEscaleta";

// Valores iniciales del formulario de nueva escaleta. Es una FUNCIÓN (no una
// constante) porque la fecha debe calcularse en cada apertura: si fuera un
// objeto fijo, quien abriera la app a las 23:59 y creara una escaleta pasada la
// medianoche vería la fecha de ayer.
function programaInicial() {
  return {
    titulo: "",
    color: "#457b9d", // token base (cerulean)
    horaInicio: "10:00",
    fecha: new Date().toISOString().split("T")[0],
  };
}

export default function DashboardPage() {
  const [escaletas, setEscaletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creando, setCreando] = useState(false);

  // Estados para los modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Abre la modal SIEMPRE en limpio. Un único punto para las dos entradas
  // (botón superior y botón de la grid), así nunca arrastra datos anteriores.
  const abrirCrear = () => {
    setNuevoPrograma(programaInicial());
    setIsCreateOpen(true);
  };
  const [previewData, setPreviewData] = useState<any>(null);

  // Estado del formulario
  const [nuevoPrograma, setNuevoPrograma] = useState(programaInicial);

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

    // Se abre la pestaña YA, dentro del gesto del usuario (submit). Si se
    // esperara a que termine el insert (dos awaits abajo), el navegador ya no
    // lo consideraría parte del clic y bloquearía el popup. Se abre "en blanco"
    // y se le pone la URL cuando tengamos el slug.
    //
    // Nota: NO se pasa "noopener" aquí, porque con esa bandera window.open
    // devuelve null y perderíamos la referencia para redirigirla. En su lugar
    // se anula el opener a mano más abajo (mismo efecto de seguridad).
    const pestana = window.open("about:blank", "_blank");

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

      // Ya con el slug, se redirige la pestaña abierta. El editor no tiene
      // botón de regresar, por eso va en pestaña aparte: la lista queda detrás.
      const destino = `/editor/${data.slug}`;
      if (pestana) {
        // Seguridad: evita que la nueva pestaña pueda manipular a la de origen
        // (tabnabbing). Sustituye a "noopener", que no pudimos usar arriba.
        pestana.opener = null;
        pestana.location.href = destino;
      } else {
        // Si el navegador bloqueó el popup pese a todo, no dejamos al usuario
        // sin su escaleta: se navega en la misma pestaña como respaldo.
        router.push(destino);
      }

      // Se cierra la modal y se refresca la lista, para que la nueva escaleta
      // aparezca en esta pestaña sin recargar a mano. El formulario se limpia
      // solo al volver a abrir (abrirCrear), así que aquí no hace falta.
      setIsCreateOpen(false);
      setCreando(false);
      cargarEscaletas();
    } catch (error) {
      console.error("Error al crear:", error);
      // Si algo falló, se cierra la pestaña en blanco que se abrió por
      // adelantado para no dejar una ventana huérfana.
      pestana?.close();
      alert("Error al crear la escaleta.");
      setCreando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 font-sans relative transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-main">Mis Escaletas</h1>
            <p className="text-muted mt-1">
              Gestiona tus programas y tiempos en vivo
            </p>
          </div>
          <button
            onClick={abrirCrear}
            className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-text px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> Nueva Escaleta
          </button>
        </div>

        {/* Grid de Tarjetas */}
        <EscaletasGrid
          escaletas={escaletas}
          onCardClick={(escaleta) => setPreviewData(escaleta)}
          onCrearClick={abrirCrear}
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
