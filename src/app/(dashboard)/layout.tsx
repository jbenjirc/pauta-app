"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar"; // Ajusta el path si es necesario

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      <main className="flex-1 overflow-y-auto w-full relative">{children}</main>

      {/* Aquí montaremos el modal de Crear Escaleta posteriormente */}
      {/* <ModalCrear isModalOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} /> */}
    </div>
  );
}
