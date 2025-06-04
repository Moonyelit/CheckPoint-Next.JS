//head title, description, icon, langue

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/layout.scss";
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import HydrationFix from '@/components/common/HydrationFix';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Checkout",
  icons: {
    icon: "/images/Logo/Crystal.png", 
  },
  description: "La plateforme gamifiée pour suivre ta progression et gérer ta collection de jeux vidéo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col pt-[7%]`}
      >
        <HydrationFix />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
