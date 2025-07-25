"use client";
import React, { useState } from 'react';
import "./styles/Footer.scss";
import '../../styles/globals.scss';
import classNames from 'classnames';
import LegalModal from './LegalModal';

const Footer = () => {
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy'>('terms');

  const openLegalModal = (tab: 'terms' | 'privacy') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  return (
    <footer className={classNames("footer")} role="contentinfo" aria-label="Pied de page">
      <div className="footer-content">
        {/* Liens de navigation principaux */}
        <nav aria-label="Navigation du footer" className="footer-content-nav">
          <ul className="footer-content-nav-links" role="list">
            <li role="listitem">
              <a 
                href="#contact" 
                aria-label="Nous contacter"
                title="Nous contacter"
              >
                Contact
              </a>
            </li>
            <li role="listitem">
              <a 
                href="#equipe" 
                aria-label="Découvrir notre équipe"
                title="Découvrir notre équipe"
              >
                L&apos;équipe
              </a>
            </li>
            <li role="listitem">
              <button 
                type="button"
                onClick={() => openLegalModal('terms')}
                className="footer-legal-link"
                aria-label="Lire les informations légales"
                aria-haspopup="dialog"
                aria-expanded={isLegalModalOpen && legalModalTab === 'terms'}
              >
                Informations légales
              </button>
            </li>
            <li role="listitem">
              <button 
                type="button"
                onClick={() => openLegalModal('privacy')}
                className="footer-legal-link"
                aria-label="Lire la politique de confidentialité"
                aria-haspopup="dialog"
                aria-expanded={isLegalModalOpen && legalModalTab === 'privacy'}
              >
                Politique de confidentialité
              </button>
            </li>
          </ul>
        </nav>

        {/* Réseaux sociaux  pour plus tard */}
        {/* <div className="socialMedia" role="group" aria-label="Réseaux sociaux">
          <a href="#" aria-label="Rejoindre notre serveur Discord" className="socialLink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
            </svg>
          </a>
          <a href="#" aria-label="Suivre CheckPoint sur Twitter" className="socialLink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" aria-label="Suivre CheckPoint sur Facebook" className="socialLink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" aria-label="Suivre CheckPoint sur YouTube" className="socialLink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div> */}

        {/* Copyright */}
        <div className="footer-copyright" role="contentinfo">
          <p className="footer-copyright-Text">
            © 2025 CheckPoint v.1.0 | Game database powered by IGDB
          </p>
        </div>
      </div>

      <LegalModal 
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </footer>
  );
};

export default Footer;