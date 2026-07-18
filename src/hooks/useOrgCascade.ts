// src/hooks/useOrgCascade.ts
"use client";
// Máquina de estado para los 5 dropdowns dependientes:
// División -> Unión -> Campo Local -> Distrito -> Iglesia.
// Cuando cambia un nivel, se limpian y recargan los niveles inferiores.
// La UI (StepEclesiastica) sólo consume `niveles` y llama `seleccionar`.
import { useCallback, useEffect, useState } from "react";
import {
  obtenerDivisiones,
  obtenerUniones,
  obtenerCamposLocales,
  obtenerDistritos,
  obtenerIglesias,
  obtenerPaisDeCampoLocal,
  type NodoOrg,
  type NivelOrg,
} from "@/lib/org/orgQueries";

interface EstadoNivel {
  opciones: NodoOrg[];
  seleccionId: string | null;
  cargando: boolean;
}

const nivelVacio = (): EstadoNivel => ({
  opciones: [],
  seleccionId: null,
  cargando: false,
});

export interface SeleccionOrg {
  divisionId: string | null;
  unionId: string | null;
  campoLocalId: string | null;
  distritoId: string | null;
  iglesiaId: string | null;
  pais: string | null;
}

export function useOrgCascade(activo: boolean) {
  const [division, setDivision] = useState<EstadoNivel>(nivelVacio());
  const [union, setUnion] = useState<EstadoNivel>(nivelVacio());
  const [campo, setCampo] = useState<EstadoNivel>(nivelVacio());
  const [distrito, setDistrito] = useState<EstadoNivel>(nivelVacio());
  const [iglesia, setIglesia] = useState<EstadoNivel>(nivelVacio());
  const [pais, setPais] = useState<string | null>(null);

  // Carga inicial de divisiones cuando la sección se activa (es miembro = sí).
  useEffect(() => {
    if (!activo || division.opciones.length > 0) return;
    setDivision((d) => ({ ...d, cargando: true }));
    obtenerDivisiones()
      .then((ops) =>
        setDivision({ opciones: ops, seleccionId: null, cargando: false }),
      )
      .catch(() => setDivision((d) => ({ ...d, cargando: false })));
  }, [activo, division.opciones.length]);

  const seleccionar = useCallback(async (nivel: NivelOrg, id: string) => {
    switch (nivel) {
      case "division": {
        setDivision((d) => ({ ...d, seleccionId: id }));
        setUnion({ ...nivelVacio(), cargando: true });
        setCampo(nivelVacio());
        setDistrito(nivelVacio());
        setIglesia(nivelVacio());
        setPais(null);
        const ops = await obtenerUniones(id);
        setUnion({ opciones: ops, seleccionId: null, cargando: false });
        break;
      }
      case "union": {
        setUnion((u) => ({ ...u, seleccionId: id }));
        setCampo({ ...nivelVacio(), cargando: true });
        setDistrito(nivelVacio());
        setIglesia(nivelVacio());
        setPais(null);
        const ops = await obtenerCamposLocales(id);
        setCampo({ opciones: ops, seleccionId: null, cargando: false });
        break;
      }
      case "campo_local": {
        setCampo((c) => ({ ...c, seleccionId: id }));
        setDistrito({ ...nivelVacio(), cargando: true });
        setIglesia(nivelVacio());
        // País se deriva justo al elegir campo local.
        obtenerPaisDeCampoLocal(id)
          .then(setPais)
          .catch(() => setPais(null));
        const ops = await obtenerDistritos(id);
        setDistrito({ opciones: ops, seleccionId: null, cargando: false });
        break;
      }
      case "distrito": {
        setDistrito((d) => ({ ...d, seleccionId: id }));
        setIglesia({ ...nivelVacio(), cargando: true });
        const ops = await obtenerIglesias(id);
        setIglesia({ opciones: ops, seleccionId: null, cargando: false });
        break;
      }
      case "iglesia": {
        setIglesia((i) => ({ ...i, seleccionId: id }));
        break;
      }
    }
  }, []);

  const seleccion: SeleccionOrg = {
    divisionId: division.seleccionId,
    unionId: union.seleccionId,
    campoLocalId: campo.seleccionId,
    distritoId: distrito.seleccionId,
    iglesiaId: iglesia.seleccionId,
    pais,
  };

  const completo = Boolean(iglesia.seleccionId);

  return {
    niveles: { division, union, campo, distrito, iglesia },
    seleccion,
    completo,
    seleccionar,
  };
}
