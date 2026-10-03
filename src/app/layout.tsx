import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { SiteFooter } from "@/components/site-footer";
import { MotionRoot, ScrollProgress } from "@/components/motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const siteUrl = "https://principai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Principai — Software engineering principles, curated for AI agents",
    template: "%s | Principai",
  },
  description:
    "A public library of software engineering principles in an AI-friendly format. Copy a small, relevant, sharp subset into your project so agents obey it — backed by technical enforcement, not just prompts.",
  keywords: [
    "software engineering principles",
    "AI agents",
    "least authority",
    "fail-safe defaults",
    "idempotency",
    "engineering laws",
    "agent guardrails",
  ],
  authors: [{ name: "LumineCode", email: "luminecode@proton.me" }],
  creator: "LumineCode",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Principai — Software engineering principles, curated for AI agents",
    description:
      "A public library of software engineering principles in an AI-friendly format. Exhaustive archive, curated profiles, technical enforcement, evals.",
    url: siteUrl,
    siteName: "Principai",
    type: "website",
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "Principai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Principai",
    description:
      "Software engineering principles, curated for AI agents. Read INDEX, obey must-follow, verify critical.",
    images: ["/images/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#070707",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <RootProvider
          theme={{ forcedTheme: "dark", enableSystem: false }}
          search={{
            preload: false,
            options: {
              api: "/api/search",
              allowClear: true,
            },
          }}
        >
          <MotionRoot>
            <ScrollProgress />
            <div className="flex-1 flex flex-col">{children}</div>
            <SiteFooter />
          </MotionRoot>
        </RootProvider>
      </body>
    </html>
  );
}
