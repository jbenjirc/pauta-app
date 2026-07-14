// src/middleware.ts
// Versión ampliada: además de proteger /editor, ahora:
//  - protege /inicio y /nuevo-usuario (requieren sesión)
//  - obliga a completar el onboarding antes de entrar al dashboard
//  - impide volver a /nuevo-usuario si ya se completó
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const RUTAS_PROTEGIDAS = [
  "/editor",
  "/inicio",
  "/nuevo-usuario",
  "/escaletas",
  "/proyectos",
  "/plantillas",
  "/explorar",
];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const esProtegida = RUTAS_PROTEGIDAS.some((r) => path.startsWith(r));

  // 1. Sin sesión en ruta protegida -> a la landing
  if (!user && esProtegida) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 2. Con sesión: verificar estado de onboarding
  if (user) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("onboarding_completo")
      .eq("id", user.id)
      .single();

    const completo = Boolean(perfil?.onboarding_completo);

    // 2a. No completó y quiere entrar al dashboard -> forzar onboarding
    if (!completo && esProtegida && !path.startsWith("/nuevo-usuario")) {
      const url = request.nextUrl.clone();
      url.pathname = "/nuevo-usuario";
      return NextResponse.redirect(url);
    }

    // 2b. Ya completó pero vuelve a /nuevo-usuario -> mándalo al inicio
    if (completo && path.startsWith("/nuevo-usuario")) {
      const url = request.nextUrl.clone();
      url.pathname = "/inicio";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
