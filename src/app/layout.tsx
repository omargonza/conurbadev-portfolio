import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_NAME = "conurbaDEV — Portfolio";
const DESCRIPTION =
  "conurbaDEV (Omar Gonzalo Martínez). Backend Python/Django: APIs, datos, auth, performance, PDFs y deploy. Freelance remoto.";

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
    template: "%s · conurbaDEV",
  },
  description: DESCRIPTION,

  applicationName: "conurbaDEV Portfolio",
  authors: [{ name: "Gonza Martínez", url: "https://github.com/omargonza" }],
  creator: "Gonza Martínez",
  publisher: "conurbaDEV",
  category: "technology",

  keywords: [
    "conurbadev",
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
      <body className="noise">{children}</body>
    </html>
  );
}