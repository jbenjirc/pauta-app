// src/contextos/ThemeContext.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Evitamos errores de hidratación asegurando que solo renderice en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderizamos la estructura sin aplicar tema hasta que Next.js hidrate
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system" // Usa el default del S.O. por defecto
      enableSystem={true}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
