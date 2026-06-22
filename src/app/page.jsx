import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a Pauta</h1>
      <Link
        href="/editor"
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Ir al Editor de Escaletas
      </Link>
    </div>
  );
}
