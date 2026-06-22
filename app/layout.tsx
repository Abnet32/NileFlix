import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

// const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const lexend = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nile-flix.vercel.app"),
  title: "NileFlix",
  description:
    "A free movie discovery website built with Next.js, Tailwind CSS, and TypeScript.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "nileflix",
    description: "free movie discovery website.",
    type: "website",
    images: {
      url: "/opengraph.png",
      width: 1200,
      height: 630,
      alt: "nileflix",
    },
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", lexend.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
