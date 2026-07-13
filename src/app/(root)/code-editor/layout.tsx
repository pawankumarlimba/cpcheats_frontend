import Sidebar from "@/components/code-editor/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex container-fluid min-h-screen">
      <div className="flex-1 flex flex-col">
        <div>
          <Sidebar />
          <main className="flex-1 py-0 px-0 ml-[70px] md:ml-[105px] lg:ml-[210px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}