import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Numeria Institute — Apprends les sciences par la pratique",
  description:
    "Plateforme d'apprentissage interactive pour la physique, les mathématiques et la programmation. Cours structurés, laboratoires PhET-style, exercices corrigés. Pensée pour les apprenants francophones.",
  keywords: [
    "Numeria",
    "cours en ligne",
    "physique",
    "mécanique quantique",
    "mécanique classique",
    "Python",
    "programmation",
    "éducation francophone",
    "Afrique",
    "sciences",
  ],
  authors: [{ name: "Numeria Institute" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Numeria Institute",
    description:
      "Apprends les sciences par la pratique : physique, maths, programmation.",
    siteName: "Numeria Institute",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Numeria Institute",
    description:
      "Apprends les sciences par la pratique : physique, maths, programmation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
