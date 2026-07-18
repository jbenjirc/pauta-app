// src/app/auth/callback/route.ts
// Maneja el retorno del enlace de confirmación de correo (verificación en 2
// pasos de Supabase). Intercambia el "code" por una sesión y redirige a `next`.
//
// Clave: en un Route Handler hay que escribir las cookies de sesión SOBRE la
// respuesta de redirección. Si se delega al client genérico (que las escribe
// en el cookieStore con try/catch silencioso), la sesión puede NO persistir y
// el usuario acaba tratado como "sin sesión" -> lo mandan al inicio.
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/registro/confirmado";

  if (!code) {
    return NextResponse.redirect(`${origin}/entrar?error=sin_code`);
  }

  // Se crea la respuesta ANTES para poder colgarle las cookies de sesión.
  const respuesta = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return (
            request.headers
              .get("cookie")
              ?.split("; ")
              .map((c) => {
                const [name, ...rest] = c.split("=");
                return { name, value: rest.join("=") };
              }) ?? []
          );
        },
        setAll(cookiesToSet) {
          // Aquí es donde se persiste la sesión: en la respuesta que redirige.
          cookiesToSet.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/entrar?error=auth_callback`);
  }

  return respuesta;
}
