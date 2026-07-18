// src/app/(onboarding)/nuevo-usuario/page.tsx
// Server Component: protege la ruta y decide si mostrar el wizard.
//  - Sin sesión -> /entrar
//  - Onboarding ya completo -> /inicio
//  - En otro caso -> monta el wizard con el userId.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default async function NuevoUsuarioPage() {
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

  if (perfil?.onboarding_completo) redirect("/inicio");

  return <OnboardingWizard userId={user.id} />;
}
