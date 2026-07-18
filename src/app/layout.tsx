import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProviderWrapper } from "@/components/providers/session-provider";

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
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  applicationName: "Numeria Institute",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Numeria Institute",
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
        <ThemeProvider>
          <SessionProviderWrapper>
            {children}
            <Toaster />
            <SonnerToaster />
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
