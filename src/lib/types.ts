// src/lib/types.ts

export type Bloque = {
  id: string;
  duracion: number;
  actividad: string;
  participante: string;
  recursos: string;
};

// Este es el bloque extendido que incluye los tiempos calculados para la vista
export type BloqueCalculado = Bloque & {
  horaInicioFormat: string;
  horaFinFormat: string;
};
