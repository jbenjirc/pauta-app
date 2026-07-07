// src/lib/types.ts

export type Bloque = {
  id: string;
  escaleta_id?: string;
  orden?: number;
  duracion: number;
  actividad: string;
  participante: string;
  recursos?: string; // Mantenemos el que ya tenías por si lo usas en otro lado

  // Nuevos campos agregados para la BD y el Editor
  notas_bloque?: string;
  responsable_tecnico?: string;
  recursos_drive_url?: string;
  comentarios_cabina?: string;
  es_nuevo?: boolean;
};

// Este es el bloque extendido que incluye los tiempos calculados para la vista
export type BloqueCalculado = Bloque & {
  horaInicioFormat: string;
  horaFinFormat: string;
};
