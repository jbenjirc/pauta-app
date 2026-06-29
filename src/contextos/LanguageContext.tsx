"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import es from "@/local/lenguajes/es.json";
import en from "@/local/lenguajes/en.json";

// 1. Mapeamos los JSON a un objeto manejable
const dictionaries: Record<string, any> = {
  ES: es,
  EN: en,
};

// 2. Definimos las reglas (TypeScript)
interface LanguageContextType {
  currentLang: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string; // La función mágica que traducirá los textos
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState("ES");

  // Al cargar la app, revisamos si el usuario ya tenía un idioma guardado
  useEffect(() => {
    const guardado = localStorage.getItem("idioma-pauta");
    if (guardado && dictionaries[guardado]) {
      setCurrentLang(guardado);
    }
  }, []);

  // Función para cambiar de idioma y guardar en memoria
  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem("idioma-pauta", lang);
  };

  // Función "t" (translate): Busca la ruta del texto en el JSON
  // Ejemplo de uso: t("navbar.login") -> Busca "navbar", luego "login"
  const t = (path: string) => {
    const keys = path.split(".");
    let result = dictionaries[currentLang];

    for (const key of keys) {
      if (result[key] === undefined) return path; // Si no lo encuentra, devuelve la ruta
      result = result[key];
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 3. Creamos un Hook personalizado para que usarlo sea facilísimo
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useTranslation debe usarse dentro de un LanguageProvider");
  return context;
};
