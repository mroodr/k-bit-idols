import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// 1. IMPORTANTE: globals.css debe ir PRIMERO para inicializar Tailwind
import "./globals.css";



// 3. Finalmente los providers
import { Providers } from "./providers"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "K-BIT IDOLS - Genera tus ídolos con IA",
  description: "Genera música e imágenes únicas de ídolos K-Pop con inteligencia artificial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}