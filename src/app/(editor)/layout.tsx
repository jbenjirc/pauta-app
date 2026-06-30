export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-surface flex flex-col">
      <main className="flex-1 w-full h-full relative">{children}</main>
    </div>
  );
}
