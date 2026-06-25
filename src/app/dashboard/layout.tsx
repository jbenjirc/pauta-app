import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* La barra lateral a la izquierda */}
      <Sidebar />

      {/* El área principal donde se cargará el Dashboard o el Editor */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
