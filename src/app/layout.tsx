import type { Metadata } from "next";
import "./globals.css";
import { nunito } from "@/utils/fonts";

import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Manga Reader - Read Manga, Anime, Manhua, and Donghua Online",
  description:
    "Discover a vast collection of manga, anime, manhua, and donghua on Manga Reader. Enjoy high-quality translations and stay updated with the latest releases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} font-sans`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
