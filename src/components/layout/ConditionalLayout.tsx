"use client";

import { usePathname } from 'next/navigation';
import NoLoginNavbar from '@/components/common/NoLoginNavbar';
import Footer from '@/components/common/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Pages qui ne doivent pas avoir la navbar et footer par défaut
  const excludedPages = ['/inscription'];
  const shouldShowDefaultLayout = !excludedPages.includes(pathname);

  if (shouldShowDefaultLayout) {
    return (
      <>
        <NoLoginNavbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </>
    );
  }

  // Pour les pages exclues (comme inscription), afficher seulement le contenu
  return <>{children}</>;
} 