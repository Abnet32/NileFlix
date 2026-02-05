import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abe Garage - አቤ ጋራዥ",
  description:
    "Abe Garage is a car repair and maintenance service located in Addis Ababa, Ethiopia. We provide high-quality services to keep your vehicle running smoothly. Our team of experienced mechanics is dedicated to ensuring your satisfaction and the longevity of your vehicle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>{children}</body>
    </html>
  );
}
