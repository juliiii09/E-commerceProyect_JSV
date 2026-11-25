import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { FloatingAiAdvisor } from "@/components/ai/floating-ai-advisor";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Meve-commerce | Cosmética Clínica Limpia & Skincare con IA",
  description: "Meve-commerce: Fórmulas dermatológicas botánicas de alta pureza y personalización de rutinas con Inteligencia Artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <FloatingAiAdvisor />
        <Footer />
      </body>
    </html>
  );
}
