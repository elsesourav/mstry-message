import Navbar from "@/components/Navbar";
import { RootLayoutProps } from "@/types/Base";



export default async function RootLayout({ children }: RootLayoutProps) {
   return (
      <div className="flex flex-col min-h-svh">
         <Navbar />
         {children}
      </div>
   );
}
