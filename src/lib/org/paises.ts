// src/lib/org/paises.ts
/**
 * Catálogo de países (ISO-3166 alpha-2), que es el formato que guarda
 * perfiles.pais y org_campos_locales.pais.
 *
 * Lista acotada a la presencia de la IASD en Iberoamérica + los más probables.
 * Es un archivo de datos plano a propósito: agregar un país es una línea, y no
 * requiere tocar la BD.
 *
 * ¿Crecerá mucho? Cuando así sea, muévelo a una tabla `paises` y léelo con una
 * query; la firma de PAISES ya es la de un catálogo, así que el cambio sería
 * local a este archivo.
 */
export interface Pais {
  codigo: string; // ISO-3166 alpha-2
  nombre: string;
}

export const PAISES: Pais[] = [
  { codigo: "AR", nombre: "Argentina" },
  { codigo: "BO", nombre: "Bolivia" },
  { codigo: "BR", nombre: "Brasil" },
  { codigo: "CL", nombre: "Chile" },
  { codigo: "CO", nombre: "Colombia" },
  { codigo: "CR", nombre: "Costa Rica" },
  { codigo: "CU", nombre: "Cuba" },
  { codigo: "DO", nombre: "República Dominicana" },
  { codigo: "EC", nombre: "Ecuador" },
  { codigo: "SV", nombre: "El Salvador" },
  { codigo: "ES", nombre: "España" },
  { codigo: "US", nombre: "Estados Unidos" },
  { codigo: "GT", nombre: "Guatemala" },
  { codigo: "HN", nombre: "Honduras" },
  { codigo: "MX", nombre: "México" },
  { codigo: "NI", nombre: "Nicaragua" },
  { codigo: "PA", nombre: "Panamá" },
  { codigo: "PY", nombre: "Paraguay" },
  { codigo: "PE", nombre: "Perú" },
  { codigo: "PR", nombre: "Puerto Rico" },
  { codigo: "PT", nombre: "Portugal" },
  { codigo: "UY", nombre: "Uruguay" },
  { codigo: "VE", nombre: "Venezuela" },
];

/** Nombre legible a partir del código. Devuelve el código si no está mapeado. */
export function nombrePais(codigo: string | null): string | null {
  if (!codigo) return null;
  return PAISES.find((p) => p.codigo === codigo)?.nombre ?? codigo;
}
