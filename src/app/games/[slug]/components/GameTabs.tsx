"use client";

import { useState } from 'react';
import './styles/GameTabs.scss';

// Je définis les types pour les props du composant.
// Pour l'instant, `game` est de type `any` mais on pourra le typer plus précisément.
interface GameTabsProps {
  game: any;
  ficheContent: React.ReactNode;
}

export default function GameTabs({ game, ficheContent }: GameTabsProps) {
  const [activeTab, setActiveTab] = useState('fiche');

  const tabs = [
    { id: 'fiche', label: 'FICHE', content: ficheContent },
    { id: 'media', label: 'MEDIA', content: <div>Contenu de l&apos;onglet Média à venir.</div> },
    { id: 'critiques', label: 'CRITIQUES', content: <div>Contenu de l&apos;onglet Critiques à venir.</div> },
    { id: 'challenges', label: 'CHALLENGES', content: <div>Contenu de l&apos;onglet Challenges à venir.</div> },
  ];

  const renderContent = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.content : null;
  };

  return (
    <div className="game-tabs">
      <nav className="tabs-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
} 