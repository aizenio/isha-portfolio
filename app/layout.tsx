import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/chrome/Nav";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { TransitionMain, TransitionProvider } from "@/components/chrome/Transition";
import { MotionProvider } from "@/components/chrome/MotionProvider";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { IntroProvider } from "@/components/chrome/Intro";
import { SurfaceBackdrop } from "@/components/chrome/SurfaceBackdrop";
import { designer } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${designer.name} — ${designer.role}`,
    template: `%s — ${designer.name}`,
  },
  description: designer.statement,
  openGraph: {
    title: `${designer.name} — ${designer.role}`,
    description: designer.statement,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e7e8e5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e100f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-surface="paper"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only rounded-none focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>

        <SurfaceBackdrop />

        <MotionProvider>
          <SmoothScroll />

          <IntroProvider>
            <TransitionProvider>
              <Nav />
              <CustomCursor />

              <TransitionMain>{children}</TransitionMain>
            </TransitionProvider>
          </IntroProvider>
        </MotionProvider>

        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
