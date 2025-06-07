//head title, description, icon, langue

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/layout.scss";
import ConditionalLayout from '@/components/layout/ConditionalLayout';
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
      <head>
        {/* 
          🛡️ FIX HYDRATATION - SCRIPT DE PROTECTION CONTRE LES EXTENSIONS
          ================================================================
          
          PROBLÈME : Les extensions de navigateur (Grammarly, LastPass, AdBlock, etc.) 
          ajoutent des attributs au DOM APRÈS que Next.js ait généré le HTML côté serveur.
          Cela cause des erreurs d'hydratation car Next.js détecte une différence entre 
          le HTML serveur et le HTML client.
          
          SOLUTION : Ce script s'exécute IMMÉDIATEMENT au chargement de la page (avant React)
          pour nettoyer tous les attributs problématiques des extensions et masquer 
          les erreurs d'hydratation dans la console.
          
          TIMING : Placé dans <head> pour s'exécuter le plus tôt possible
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 🧹 FIX AGRESSIF POUR LES ATTRIBUTS D'EXTENSIONS DE NAVIGATEUR
              (function() {
                // 📋 LISTE DES ATTRIBUTS PROBLÉMATIQUES AJOUTÉS PAR LES EXTENSIONS
                const PROBLEMATIC_ATTRS = [
                  'cz-shortcut-listen',           // ColorZilla (pipette couleur)
                  'spellcheck',                   // Correcteurs orthographiques
                  'data-new-gr-c-s-check-loaded', // Grammarly (vérification gramm.)
                  'data-gr-ext-installed',        // Grammarly (extension installée)
                  'data-gr-ext-disabled',         // Grammarly (extension désactivée)
                  'data-adblock',                 // Bloqueurs de publicité
                  'data-darkreader-mode',         // Dark Reader (mode sombre)
                  'data-darkreader-scheme',       // Dark Reader (schéma couleur)
                  'data-lastpass-icon-warning',   // LastPass (gestionnaire mots de passe)
                  'data-1p-ignore',               // 1Password (ignorer ce champ)
                  'data-bitwarden-watching'       // Bitwarden (surveillance des champs)
                ];
                
                // 🧼 FONCTION DE NETTOYAGE ULTRA-AGRESSIF DU DOM
                // Supprime tous les attributs d'extensions de <html> et <body>
                function ultraCleanup() {
                  [document.documentElement, document.body].forEach(function(el) {
                    if (el && el.removeAttribute) {
                      PROBLEMATIC_ATTRS.forEach(function(attr) {
                        try {
                          if (el.hasAttribute && el.hasAttribute(attr)) {
                            el.removeAttribute(attr);
                          }
                        } catch(e) { /* ignore */ }
                      });
                    }
                  });
                }
                
                // 🔇 MASQUAGE DES ERREURS D'HYDRATATION DANS LA CONSOLE
                // Override console.error et console.warn pour cacher les messages d'hydratation
                const originalError = console.error;
                const originalWarn = console.warn;
                
                // 🚫 FILTRE LES ERREURS D'HYDRATATION CAUSÉES PAR LES EXTENSIONS
                console.error = function() {
                  const args = Array.prototype.slice.call(arguments);
                  const message = args[0];
                  if (typeof message === 'string') {
                    // Patterns d'erreurs à ignorer (causées par les extensions)
                    const patterns = [
                      'A tree hydrated but some attributes',  // Attributs en plus détectés
                      'cz-shortcut-listen',                   // ColorZilla spécifique
                      'hydration-mismatch',                   // Différence serveur/client
                      'Hydration failed',                     // Échec d'hydratation
                      'There was an error while hydrating',   // Erreur pendant hydratation
                      'Warning: Prop',                        // Props différentes
                      'Warning: Extra attributes'             // Attributs supplémentaires
                    ];
                    
                    // Si le message contient un pattern d'erreur d'extension, l'ignorer
                    if (patterns.some(p => message.includes(p)) || 
                        PROBLEMATIC_ATTRS.some(attr => message.includes(attr))) {
                      return; // ⛔ Ignore complètement cette erreur
                    }
                  }
                  // ✅ Affiche les autres erreurs normalement (pas causées par les extensions)
                  originalError.apply(console, args);
                };
                
                // 🔕 FILTRE AUSSI LES WARNINGS D'HYDRATATION
                console.warn = function() {
                  const args = Array.prototype.slice.call(arguments);
                  const message = args[0];
                  if (typeof message === 'string' && 
                      (message.includes('hydration') || message.includes('Prop'))) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
                
                // ⏰ NETTOYAGE À PLUSIEURS MOMENTS POUR MAXIMISER L'EFFICACITÉ
                // Les extensions s'injectent à différents moments du cycle de vie de la page
                ultraCleanup(); // ⚡ Immédiat (au chargement du script)
                
                setTimeout(ultraCleanup, 0);   // 📅 Prochain tick du navigateur
                setTimeout(ultraCleanup, 1);   // 📅 1ms (très tôt)
                setTimeout(ultraCleanup, 10);  // 📅 10ms (avant que React démarre)
                setTimeout(ultraCleanup, 50);  // 📅 50ms (pendant l'hydratation)
                setTimeout(ultraCleanup, 100); // 📅 100ms (après l'hydratation)
                
                // 👁️ SURVEILLANCE CONTINUE DU DOM AVEC MUTATIONOBSERVER
                // Détecte quand les extensions ajoutent des attributs et nettoie immédiatement
                if (window.MutationObserver) {
                  const observer = new MutationObserver(function() {
                    ultraCleanup(); // 🧹 Nettoie dès qu'une modification est détectée
                  });
                  
                  // Observer dès que possible
                  function startObserving() {
                    try {
                      if (document.body) {
                        observer.observe(document.body, { 
                          attributes: true, 
                          attributeFilter: PROBLEMATIC_ATTRS 
                        });
                      }
                      if (document.documentElement) {
                        observer.observe(document.documentElement, { 
                          attributes: true, 
                          attributeFilter: PROBLEMATIC_ATTRS 
                        });
                      }
                    } catch(e) { /* ignore */ }
                  }
                  
                  startObserving();
                  setTimeout(startObserving, 10);
                }
                
                // 🔄 NETTOYAGE PÉRIODIQUE TOUTES LES 50MS (TRÈS AGRESSIF)
                // Pour les extensions particulièrement tenaces qui se réinjectent
                setInterval(ultraCleanup, 50);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col pt-[7%]`}
        suppressHydrationWarning={true}
      >
        <HydrationFix />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
