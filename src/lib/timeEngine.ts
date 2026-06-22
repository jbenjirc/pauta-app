// src/lib/timeEngine.ts
import { Bloque, BloqueCalculado } from "./types";

export const tiempoAMinutos = (tiempo: string) => {
  const [horas, minutos] = tiempo.split(":").map(Number);
  return horas * 60 + minutos;
};

export const minutosATiempo = (totalMinutos: number) => {
  const horas = Math.floor(totalMinutos / 60) % 24;
  const minutos = totalMinutos % 60;
  return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
};

export const calcularTiemposEscaleta = (
  horaInicio: string,
  bloques: Bloque[],
): BloqueCalculado[] => {
  let tiempoAcumulado = tiempoAMinutos(horaInicio);

  return bloques.map((bloque) => {
    const inicio = tiempoAcumulado;
    const fin = inicio + (bloque.duracion || 0);
    tiempoAcumulado = fin; // Actualiza para el siguiente ciclo

    return {
      ...bloque,
      horaInicioFormat: minutosATiempo(inicio),
      horaFinFormat: minutosATiempo(fin),
    };
  });
};
