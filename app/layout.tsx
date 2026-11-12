import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/content/site";
import "./tokens.css";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["500"],
  subsets: ["latin"],
});

const title = "Vijayaganth – Portfolio";

export const metadata: Metadata = {
  title,
  description: site.hero.body,
  authors: [{ name: site.name, url: site.linkedin }],
  openGraph: {
    type: "website",
    title,
    description: site.hero.body,
    siteName: site.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title,
    description: site.hero.body,
  },
};

export const viewport: Viewport = {
  themeColor: "#06111f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
