import React from "react";
import "./styles/TabsNav.scss";

export type TabType = "fiche" | "media" | "critiques" | "challenges";

interface TabsNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function TabsNav({ activeTab, setActiveTab }: TabsNavProps) {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "fiche", label: "FICHE", icon: "/images/Icons/svg/fiche-icon.svg" },
    { id: "media", label: "MEDIA", icon: "/images/Icons/svg/graphisme-icon.svg" },
    { id: "critiques", label: "CRITIQUES", icon: "/images/Icons/svg/critiques-icon.svg" },
    { id: "challenges", label: "CHALLENGES", icon: "/images/Icons/svg/challenge-icon.svg" }
  ];

  return (
    <div className="tabs-nav" role="tablist" aria-label="Navigation des sections du jeu">
      <nav className="tabs-nav__navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tabs-nav__button ${activeTab === tab.id ? 'tabs-nav__button--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            type="button"
          >
            <span className="tabs-nav__button-text">{tab.label}</span>
            <img 
              src={tab.icon} 
              alt=""
              className="tabs-nav__button-icon"
              aria-hidden="true"
            />
          </button>
        ))}
      </nav>
    </div>
  );
} 