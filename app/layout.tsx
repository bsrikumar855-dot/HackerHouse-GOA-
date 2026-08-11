import type { Metadata, Viewport } from "next";
import { Victor_Mono, Imbue } from "next/font/google";
import "./globals.css";

const victorMono = Victor_Mono({
  variable: "--font-victor-mono",
  subsets: ["latin"],
  display: "swap",
});

const imbue = Imbue({
  variable: "--font-imbue",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Frame In Goa — HH Goa 2026 Builder ID",
  description:
    "Turn any photo into an HH Goa 2026 PFP frame, Builder ID card, or team frame. Download it, share it, #FrameInGoa.",
  openGraph: {
    title: "Frame In Goa — HH Goa 2026 Builder ID",
    description:
      "Turn any photo into an HH Goa 2026 PFP frame, Builder ID card, or team frame.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b6839",
  width: "device-width",
  initialScale: 1,
};

import GrainOverlay from "@/components/GrainOverlay";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${victorMono.variable} ${imbue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <GrainOverlay />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
