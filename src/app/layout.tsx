import type { Metadata } from "next";
import { LayoutLoader } from "./components/LayoutLoader";
import { Space_Grotesk, Syne, Anton, Satisfy } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
});

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-satisfy",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Wezero — Web Agency",
    template: "%s | Wezero",
  },
  description:
    "We build websites that work. Wezero is a web agency for companies that care about the details.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://wezerostudio.pages.dev"
  ),
  openGraph: {
    title: "Wezero — Web Agency",
    description: "We build websites that work.",
    url: "/",
    siteName: "Wezero",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wezero — Web Agency",
    description: "We build websites that work.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${spaceGrotesk.variable} ${anton.variable} ${satisfy.variable}`}>
        <LayoutLoader />
        {children}
      </body>
    </html>
  );
}
