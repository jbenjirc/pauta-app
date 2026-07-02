import NavbarEditor from "@/components/editor/NavbarEditor";
import { EditorProvider } from "@/contextos/EditorContext";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EditorProvider>
      <div className="w-screen h-screen overflow-hidden bg-background text-main flex flex-col transition-colors duration-300">
        {/* Instancia limpia del Navbar en el Layout */}
        <NavbarEditor />

        <main className="flex-1 w-full h-full relative overflow-y-auto">
          {children}
        </main>
      </div>
    </EditorProvider>
  );
}
