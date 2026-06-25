// src/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Preparamos la respuesta que Next.js enviará
  let supabaseResponse = NextResponse.next({ request });

  // Creamos el cliente de servidor de Supabase interceptando las cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
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

  // Le preguntamos a Supabase si el usuario actual es válido
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // REGLA: Si NO hay usuario y quiere entrar a cualquier cosa en "/editor", lo pateamos al inicio (/)
  if (!user && request.nextUrl.pathname.startsWith("/editor")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // REGLA: Si SÍ hay usuario y está en la pantalla de login (/), lo mandamos directo al "/editor"
  //if (user && request.nextUrl.pathname === "/") {
  //  const url = request.nextUrl.clone();
  //  url.pathname = "/editor";
  //  return NextResponse.redirect(url);
  //}

  return supabaseResponse;
}

// Configuración para que el middleware no revise archivos de imagen ni CSS (por rendimiento)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
