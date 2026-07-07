// contextos/SessionContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client"; // Ajusta a tu ruta real
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  nombre: string;
  email: string;
}

interface SessionContextType {
  user: UserData | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Obtenemos el nombre desde la tabla perfiles
        const { data: profile } = await supabase
          .from("perfiles")
          .select("nombre")
          .eq("id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email!,
          nombre:
            profile?.nombre || session.user.user_metadata?.nombre || "Usuario",
        });
      }
      setIsLoading(false);
    };

    fetchSession();

    // Listener para mantener sincronizada la sesión en múltiples pestañas
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data: profile } = await supabase
            .from("perfiles")
            .select("nombre")
            .eq("id", session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email!,
            nombre:
              profile?.nombre ||
              session.user.user_metadata?.nombre ||
              "Usuario",
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <SessionContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession debe usarse dentro de SessionProvider");
  return context;
};
