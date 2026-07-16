// src/app/(dashboard)/configuracion/page.tsx
// Server Component: protege la ruta y monta el shell de configuración.
//  - Sin sesión -> /entrar
//  - Onboarding incompleto -> /nuevo-usuario (no tiene sentido configurar
//    un perfil que aún no existe completo)
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConfiguracionShell from "@/components/configuracion/ConfiguracionShell";

export default async function ConfiguracionPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("onboarding_completo")
    .eq("id", user.id)
    .single();

  if (!perfil?.onboarding_completo) redirect("/nuevo-usuario");

  // El email vive en auth (no en perfiles): se pasa ya resuelto para que la
  // sección de Seguridad no tenga que volver a pedirlo.
  return (
    <ConfiguracionShell
      userId={user.id}
      email={user.email ?? ""}
      emailVerificado={Boolean(user.email_confirmed_at)}
    />
  );
}
