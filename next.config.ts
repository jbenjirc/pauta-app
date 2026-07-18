import type { NextConfig } from "next";
import { execSync } from "node:child_process";

// Versión de la app = hash corto del commit actual. Se calcula en build-time y
// se expone al navegador como NEXT_PUBLIC_APP_VERSION, que es lo que registra
// el feedback (app_version) para saber en qué build estaba la persona.
//
// Prioridad:
//   1. NEXT_PUBLIC_APP_VERSION si ya viene del entorno (p. ej. la defines a mano)
//   2. VERCEL_GIT_COMMIT_SHA (disponible automáticamente en Vercel)
//   3. git rev-parse local
//   4. 'dev' como último recurso (si no hay git, p. ej. en un contenedor pelón)
const appVersion = (() => {
  if (process.env.NEXT_PUBLIC_APP_VERSION)
    return process.env.NEXT_PUBLIC_APP_VERSION;
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "dev";
  }
})();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
  /* config options here */
};

export default nextConfig;
