"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import lang_lib from "../local/lang-lib.json";

export interface AppLanguage {
  code: string;
  name: string;
  flag: string;
}

interface LanguageContextType {
  currentLang: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
  languages: AppLanguage[];
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState("ES");
  const [dictionary, setDictionary] = useState<Record<string, any>>({});
  const [isReady, setIsReady] = useState(false);

  const loadDictionary = async (langCode: string) => {
    setIsReady(false);

    try {
      const module = await import(
        `../local/lenguajes/${langCode.toLowerCase()}.json`
      );

      setDictionary(module.default || module);
      setCurrentLang(langCode);
      localStorage.setItem("idioma-pauta", langCode);
    } catch (error) {
      console.error(
        `Error: No se encontró el archivo de idioma para ${langCode}`,
        error,
      );
      if (langCode !== "ES") loadDictionary("ES");
    } finally {
      setIsReady(true);
    }
  };

  // 3. Al iniciar la app, cargamos el idioma guardado
  useEffect(() => {
    const guardado = localStorage.getItem("idioma-pauta") || "ES";
    loadDictionary(guardado);
  }, []);

  // 4. Cuando el Navbar pide cambiar de idioma, disparamos la descarga
  const changeLanguage = (lang: string) => {
    if (lang !== currentLang) {
      loadDictionary(lang);
    }
  };

  const t = (path: string): string => {
    const keys = path.split(".");
    let result = dictionary;

    for (const key of keys) {
      if (result?.[key] === undefined) return path;
      result = result[key];
    }

    // Si por error apuntas a un nodo padre (objeto) en vez de al texto final
    if (typeof result !== "string") {
      console.warn(
        `[Pauta App] Error de traducción: La ruta '${path}' no es un texto final.`,
      );
      return path;
    }

    return result;
  };

  // Opcional: Evitar que la página parpadee sin textos durante el milisegundo de carga
  if (!isReady && Object.keys(dictionary).length === 0) {
    return null; // O podrías poner un <div className="spinner">Cargando...</div>
  }

  return (
    <LanguageContext.Provider
      value={{ currentLang, changeLanguage, t, languages: lang_lib, isReady }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useTranslation debe usarse dentro de un LanguageProvider");
  return context;
};
