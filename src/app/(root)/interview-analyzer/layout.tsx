import Sidebar from "@/components/interview-analist/side-bar/side-bar";





export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sm:flex container-fluid sm:min-h-screen ">
      
      <div className="sm:flex-1 sm:flex sm:flex-col">
        <div className=" ">
          <div className="hidden sm:block"><Sidebar/></div>
          
          <main className=" md:container-fluid py-0 px-0 ml-0 md:ml-[150px] lg:ml-[200px]">
            {children} 
          </main>
        </div>
      </div>
    </div>
  );
}