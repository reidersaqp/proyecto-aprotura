import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "APROTURA Arequipa | Asociación de Profesionales y Técnicos de Turismo",
  description:
    "APROTURA - Asociación de Profesionales y Técnicos de Turismo Arequipa. Cursos de capacitación, actividades culturales, danzas y más. Únete a nuestra comunidad turística.",
  keywords: "turismo, Arequipa, capacitaciones, cursos, profesionales, técnicos, APROTURA",
  openGraph: {
    title: "APROTURA Arequipa",
    description: "Asociación de Profesionales y Técnicos de Turismo Arequipa",
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
