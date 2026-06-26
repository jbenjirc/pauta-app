import {
  X,
  Save,
  Video,
  UserCog,
  Headset,
  Users,
  Link as LinkIcon,
  MessageSquare,
  Loader2,
  CloudUpload,
  CloudCog,
} from "lucide-react";

type AdvancedSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  avanzados: any;
  setAvanzados: (datos: any) => void;
  onGuardarAvanzados: () => void;
  guardando: boolean;
};

export default function ControlesAvanzadosSidebar({
  isOpen,
  onClose,
  avanzados,
  setAvanzados,
  onGuardarAvanzados,
  guardando,
}: AdvancedSidebarProps) {
  // Componente interno para el Toggle Switch
  const ToggleSwitch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-orange-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel Lateral Derecho */}
      {/* Nota: Usamos w-80 o w-96 (Tailwind estándar) ya que w-70 no existe por defecto, w-96 da mejor espacio para los textos */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabecera del Sidebar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <h2 className="font-bold text-gray-900 text-lg">
            Opciones avanzadas
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            title="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Controles con Scroll */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1 bg-white">
          {/* 1. Inicio de Stream */}
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
              <Video className="w-4 h-4 text-orange-500" /> Inicio de stream
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              La transmisión comienza antes de la programación principal.
            </p>
            <input
              type="time"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              value={avanzados?.hora_inicio_stream || ""}
              onChange={(e) =>
                setAvanzados({
                  ...avanzados,
                  hora_inicio_stream: e.target.value,
                })
              }
            />
          </div>

          {/* 2. Floor Manager */}
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
              <UserCog className="w-4 h-4 text-orange-500" /> Floor manager
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Encargado de coordinar el piso durante el programa.
            </p>
            <input
              type="text"
              placeholder="Ej. Nombre del manager"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              value={avanzados?.floor_manager || ""}
              onChange={(e) =>
                setAvanzados({ ...avanzados, floor_manager: e.target.value })
              }
            />
          </div>

          {/* 3. Director Técnico */}
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
              <Headset className="w-4 h-4 text-orange-500" /> Director técnico
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Nombre del técnico principal encargado de cabina.
            </p>
            <input
              type="text"
              placeholder="Ej. Nombre del técnico"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              value={avanzados?.director_tecnico || ""}
              onChange={(e) =>
                setAvanzados({ ...avanzados, director_tecnico: e.target.value })
              }
            />
          </div>

          <hr className="border-gray-100 my-2" />

          {/* 4. Columna de Responsable (TOGGLE) */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" /> Columna
                Responsable
              </span>
              <span className="text-xs text-gray-500 mt-1 leading-relaxed">
                El encargado de la actividad no es quien ejecuta.
              </span>
            </div>
            <ToggleSwitch
              checked={!!avanzados?.mostrar_col_responsable}
              onChange={(val) =>
                setAvanzados({ ...avanzados, mostrar_col_responsable: val })
              }
            />
          </div>

          {/* 5. Columna de Recursos (TOGGLE) */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-orange-500" /> Columna
                Recursos
              </span>
              <span className="text-xs text-gray-500 mt-1 leading-relaxed">
                Enlaces a los recursos para cada actividad.
              </span>
            </div>
            <ToggleSwitch
              checked={!!avanzados?.mostrar_col_recursos}
              onChange={(val) =>
                setAvanzados({ ...avanzados, mostrar_col_recursos: val })
              }
            />
          </div>

          {/* 6. Columna de Comentarios (TOGGLE) */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-500" /> Notas de
                cabina
              </span>
              <span className="text-xs text-gray-500 mt-1 leading-relaxed">
                Comentarios técnicos específicos para el programa.
              </span>
            </div>
            <ToggleSwitch
              checked={!!avanzados?.mostrar_col_comentarios}
              onChange={(val) =>
                setAvanzados({ ...avanzados, mostrar_col_comentarios: val })
              }
            />
          </div>
        </div>

        {/* Botón de Guardado */}
        <div className="p-5 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={onGuardarAvanzados}
            disabled={guardando}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            {guardando ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CloudCog className="w-5 h-5" />
            )}
            {guardando ? "Guardando..." : "Guardar configuración"}
          </button>
        </div>
      </div>
    </>
  );
}
