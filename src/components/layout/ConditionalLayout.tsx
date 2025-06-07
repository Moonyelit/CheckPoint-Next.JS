"use client";

import MainNavbar from '@/components/common/NavBarMain';
import Footer from '@/components/common/Footer';
import { usePathname } from 'next/navigation';

/**
 * 🔄 LAYOUT CONDITIONNEL - AIGUILLEUR INTELLIGENT DE LAYOUTS
 * ==========================================================
 * 
 * PROBLÈME RÉSOLU : Certaines pages (inscription) ont besoin d'un layout spécial
 * sans navbar standard ni footer pour une immersion totale
 * 
 * FONCTIONNEMENT :
 * - Détecte la page courante avec usePathname()
 * - Si page normale : Affiche MainNavbar + contenu + Footer
 * - Si page exclue : Affiche seulement le contenu
 * 
 * AVANTAGE : Évite de dupliquer la logique dans chaque page
 */
interface ConditionalLayoutProps {
  children: React.ReactNode;
}

//*******************************************************
// Layout conditionnel selon la page
//*******************************************************
// Détermine quels composants afficher selon l'URL :
// - Si page d'auth (/inscription, /auth/*) : Contenu uniquement
// - Si page normale : Affiche MainNavbar + contenu + Footer
export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Pages qui n'affichent pas la navbar et le footer (pages d'auth)
  const authPages = ['/inscription'];
  const isAuthPage = authPages.some(page => pathname.startsWith(page));

  // Pour l'instant, on considère que l'utilisateur n'est pas connecté
  // TODO: Récupérer l'état d'authentification depuis un context/store
  // const isAuthenticated = false;
  // const user = null;

  if (isAuthPage) {
    // Pages d'authentification : uniquement le contenu
    return <>{children}</>;
  }

  return (
    <>
      <MainNavbar/>  {/* 🧭 Navbar principale intelligente */}
      <main>{children}</main>
      <Footer />  {/* 🦶 Footer global */}
    </>
  );
} 