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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Fix agressif pour les attributs d'extensions
              (function() {
                const PROBLEMATIC_ATTRS = [
                  'cz-shortcut-listen', 'spellcheck', 'data-new-gr-c-s-check-loaded',
                  'data-gr-ext-installed', 'data-gr-ext-disabled', 'data-adblock',
                  'data-darkreader-mode', 'data-darkreader-scheme', 'data-lastpass-icon-warning',
                  'data-1p-ignore', 'data-bitwarden-watching'
                ];
                
                // Nettoyage ultra-agressif
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
                
                // Masquage d'erreurs renforcé
                const originalError = console.error;
                const originalWarn = console.warn;
                
                console.error = function() {
                  const args = Array.prototype.slice.call(arguments);
                  const message = args[0];
                  if (typeof message === 'string') {
                    const patterns = [
                      'A tree hydrated but some attributes',
                      'cz-shortcut-listen',
                      'hydration-mismatch',
                      'Hydration failed',
                      'There was an error while hydrating',
                      'Warning: Prop',
                      'Warning: Extra attributes'
                    ];
                    
                    if (patterns.some(p => message.includes(p)) || 
                        PROBLEMATIC_ATTRS.some(attr => message.includes(attr))) {
                      return; // Ignore complètement
                    }
                  }
                  originalError.apply(console, args);
                };
                
                console.warn = function() {
                  const args = Array.prototype.slice.call(arguments);
                  const message = args[0];
                  if (typeof message === 'string' && 
                      (message.includes('hydration') || message.includes('Prop'))) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
                
                // Exécutions multiples avec différents timings
                ultraCleanup(); // Immédiat
                
                setTimeout(ultraCleanup, 0);   // Prochain tick
                setTimeout(ultraCleanup, 1);   // 1ms
                setTimeout(ultraCleanup, 10);  // 10ms
                setTimeout(ultraCleanup, 50);  // 50ms
                setTimeout(ultraCleanup, 100); // 100ms
                
                // Observer en continu
                if (window.MutationObserver) {
                  const observer = new MutationObserver(function() {
                    ultraCleanup();
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
                
                // Nettoyage à intervalles réguliers (plus agressif)
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
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
