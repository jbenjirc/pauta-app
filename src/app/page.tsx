"use client";

import Link from "next/link";
import { useTranslation } from "@/contextos/LanguageContext";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background transition-colors duration-300">
      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-16 md:mt-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-main tracking-tight mb-4 max-w-3xl">
          {t("index.mainLandingPage.title-fragment1")}{" "}
          <span className="text-primary">
            {t("index.mainLandingPage.title-fragment2")}
          </span>
        </h1>

        {/* Usamos el texto silenciado (muted) para la descripción */}
        <p className="text-lg text-text-muted mb-8 max-w-2xl">
          {t("index.mainLandingPage.description")}
        </p>

        <div className="flex gap-4">
          <Link
            href="/registro"
            className="text-base font-semibold bg-primary hover:opacity-90 text-primary-text px-6 py-3 rounded-xl transition-all shadow-md"
          >
            {/* También pasamos el botón al traductor */}
            {t("index.mainLandingPage.action-button")}
          </Link>
        </div>
      </main>
    </div>
  );
}
