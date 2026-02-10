import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emmaus",
  description:
    "Emmaus Diary is a private faith journal for daily Bible reading, personal reflection, and AI-guided insights—designed to help you grow consistently and meaningfully.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className}`}>{children}</body>
    </html>
  );
}
