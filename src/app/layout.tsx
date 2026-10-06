import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { SettingsProvider } from "@/components/public/SettingsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://hsebridge.ma"),
  title: "HSE BRIDGE | Solutions HSE pour des projets durables",
  description: "Plateforme complète HSE : Formations professionnelles certifiantes, Vente d'équipements EPI/EPC de qualité, et Recrutement de talents HSE qualifiés au Maroc et à l'international.",
  keywords: [
    "HSE",
    "Formation HSE",
    "EPI",
    "EPC",
    "Sécurité au travail",
    "Santé sécurité environnement",
    "Recrutement HSE",
    "Animateur HSE",
    "Supervisor HSE",
    "Équipements de protection",
    "Chantier sécurisé",
    "Maroc",
  ],
  authors: [{ name: "HSE BRIDGE" }],
  creator: "HSE BRIDGE",
  publisher: "HSE BRIDGE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "HSE BRIDGE | Solutions HSE pour des projets durables",
    description: "Formation HSE certifiante, Vente EPI/EPC de qualité, Recrutement de spécialistes HSE. Votre partenaire sécurité pour tous vos projets.",
    url: "https://hsebridge.ma",
    siteName: "HSE BRIDGE",
    images: [
      {
        url: "/brand/cover-banner.jpg",
        width: 1242,
        height: 451,
        alt: "HSE BRIDGE - Ensemble pour un avenir plus sûr",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HSE BRIDGE | Solutions HSE pour des projets durables",
    description: "Formation HSE certifiante, Vente EPI/EPC, Recrutement HSE au Maroc et à l'international.",
    images: ["/brand/cover-banner.jpg"],
  },
  icons: {
    icon: "/brand/logo-dark-transparent.png",
    shortcut: "/brand/logo-dark-transparent.png",
    apple: "/brand/logo-dark-transparent.png",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("hse_locale")?.value === "ar" ? "ar" : "fr";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-full bg-slate-950 text-slate-50">
        <I18nProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
