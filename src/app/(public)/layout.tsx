import Navbar from "@/components/ui/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">{children}</main>
    </div>
  );
}
