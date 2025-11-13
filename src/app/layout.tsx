import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { GA4Initializer } from "@/components/GA4Initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Missed The Game - Football Highlights Without Spoilers",
  description: "Never miss the thrill! Watch football highlights without knowing the score. Perfect for busy fans who want to experience matches as if they're live.",
  keywords: ["football", "highlights", "spoiler-free", "soccer", "sports", "PWA"],
  authors: [{ name: "Missed The Game" }],
  creator: "Missed The Game",
  publisher: "Missed The Game",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_DONATION_RETURN_URL || 'https://missedthegame.com'),
  openGraph: {
    title: "Missed The Game - Football Highlights Without Spoilers",
    description: "Never miss the thrill! Watch football highlights without knowing the score.",
    url: "/",
    siteName: "Missed The Game",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Missed The Game - Football Highlights Without Spoilers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Missed The Game - Football Highlights Without Spoilers",
    description: "Never miss the thrill! Watch football highlights without knowing the score.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  themeColor: "#1f2937",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Missed The Game",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <GA4Initializer />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
