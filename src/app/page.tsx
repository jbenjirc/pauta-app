import Link from "next/link";
import { Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-16 md:mt-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 max-w-3xl">
          El control total de tus tiempos,{" "}
          <span className="text-orange-600">en vivo.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl">
          Crea, edita y exporta a PDF tus escaletas multimedia. Una herramienta
          diseñada para evitar fricciones en cabina y asegurar que cada momento
          ocurra en el segundo exacto.
        </p>
        <div className="flex gap-4">
          <Link
            href="/registro"
            className="text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl transition-colors shadow-md"
          >
            Comenzar ahora
          </Link>
        </div>
      </main>
    </div>
  );
}
