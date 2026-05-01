import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-brand",
});

const SITE_NAME = "Hermit — Portfolio";
const DESCRIPTION =
  "Hermit — Portfolio de desarrollo full stack orientado a sistemas operativos, mantenimiento, trazabilidad, dashboards, e-commerce y herramientas web para procesos reales.";

// ✅ URL robusta (local / preview / prod)
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07070a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: SITE_NAME,
    template: "%s · Hermit",
  },
  description: DESCRIPTION,

  applicationName: "Hermit Portfolio",
  authors: [{ name: "Gonzalo Martínez", url: "https://github.com/omargonza" }],
  creator: "Gonzalo Martínez",
  publisher: "Hermit",
  category: "technology",

  keywords: [
    "hermit",
    "portfolio",
    "backend",
    "python",
    "django",
    "api",
    "postgresql",
    "pdf",
    "freelance",
    "argentina",
  ],

  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },

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
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Hermit — Portfolio",
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
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" }, // opcional
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }], // recomendado
  },

  manifest: "/manifest.webmanifest", // recomendado
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${cormorant.variable} noise`}>{children}</body>
    </html>
  );
}