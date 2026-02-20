import type { Metadata } from "next";
import "./globals.css";

const SITE_NAME = "conurbaDEV — Portfolio";
const DESCRIPTION =
  "conurbaDEV (Omar Gonzalo Martínez). Backend Python/Django: APIs, datos, auth, performance, PDFs y deploy. Freelance remoto.";
const BASE_URL = "https://conurbadev-portfolio.vercel.app"; // ← CAMBIAR cuando tengas dominio propio

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_NAME,
    template: "%s · conurbaDEV",
  },
  description: DESCRIPTION,
  applicationName: "conurbaDEV Portfolio",
  authors: [{ name: "Omar Gonzalo Martínez", url: "https://github.com/omargonza" }],
  creator: "conurbaDEV",
  publisher: "conurbaDEV",
  category: "technology",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    title: SITE_NAME,
    siteName: SITE_NAME,
    description: DESCRIPTION,
    locale: "es_AR",
    images: [
      {
        url: "/og.jpg", // poner en /public/og.jpg
        width: 1200,
        height: 630,
        alt: "conurbaDEV — Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" }, // poner en /public/icon.png
    ],
    apple: [{ url: "/apple-touch-icon.png" }], // opcional
  },

  themeColor: "#07070a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="noise">{children}</body>
    </html>
  );
}
