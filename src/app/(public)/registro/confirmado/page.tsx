// src/app/(public)/registro/confirmado/page.tsx
import ConfirmRedirect from "@/components/auth/ConfirmRedirect";

export default function ConfirmadoPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4 w-full">
      <ConfirmRedirect destino="/nuevo-usuario" segundos={10} />
    </div>
  );
}
