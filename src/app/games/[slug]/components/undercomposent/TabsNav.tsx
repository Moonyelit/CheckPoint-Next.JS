import React from "react";
import "../styles/TabsNav.scss";

export type TabType = "fiche" | "media" | "critiques" | "challenges";

interface TabsNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function TabsNav({ activeTab, setActiveTab }: TabsNavProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: "fiche", label: "FICHE" },
    { id: "media", label: "MEDIA" },
    { id: "critiques", label: "CRITIQUES" },
    { id: "challenges", label: "CHALLENGES" }
  ];

  return (
    <nav className="tabs-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? "tab-active" : ""}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
} 