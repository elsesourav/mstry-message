import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/utils/AuthProvider";
import { Toaster } from "sonner"
import "./globals.css"
import { RootLayoutProps } from "@/types/Base";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Mystery Message",
   description: "Mystery Message",
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <AuthProvider>
            <body
               className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
               <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
               >
                  {children}
               </ThemeProvider>
               <Toaster position="bottom-center" richColors />
            </body>
         </AuthProvider>
      </html>
   );
}
