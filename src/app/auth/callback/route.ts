// src/app/auth/callback/route.ts
// Maneja el retorno del enlace de confirmación de correo (2 pasos de Supabase).
// Intercambia el "code" por una sesión y redirige a `next`.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/registro/confirmado";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si algo falla, de vuelta a entrar con una marca de error.
  return NextResponse.redirect(`${origin}/entrar?error=auth_callback`);
}
