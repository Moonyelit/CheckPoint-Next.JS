import React, { useState, useEffect } from "react";
import FilterCard from "./FilterCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import "../styles/filterCard.scss";

interface FilterData {
  [key: string]: {
    label: string;
    values: string[];
  };
}

interface FilterContainerProps {
  onFiltersChange: (filters: { [key: string]: string[] }) => void;
}

// Correspondance entre les filtres traduits et les valeurs originales
const FILTER_MAPPING = {
  genres: {
    'Action': 'Action',
    'Aventure': 'Adventure',
    'Action-aventure': 'Action-adventure',
    'RPG': 'RPG',
    'Action RPG': ['Action RPG', 'Role-playing (RPG)'],
    'Stratégie': 'Strategy',
    'Stratégie en temps réel': 'Real Time Strategy (RTS)',
    'Stratégie au tour par tour': 'Turn-based strategy',
    'Simulation': 'Simulation',
    'Simulateur': 'Simulator',
    'Puzzle': 'Puzzle',
    'Course': 'Racing',
    'Sport': 'Sports',
    'Combat': 'Fighting',
    'Tir': 'Shooter',
    'Plateforme': 'Platform',
    'Point-and-click': 'Point-and-click',
    'Visual Novel': 'Visual Novel',
    'Indépendant': 'Indie',
    'Arcade': 'Arcade',
    'Jeu de cartes & plateau': 'Card & Board Game',
    'MOBA': 'MOBA',
    'Musique': 'Music',
    'Quiz': 'Quiz/Trivia',
    'Beat them all': 'Hack and slash/Beat em up',
    'Tactique': 'Tactical',
    'Flipper': 'Pinball',
    'MMORPG': 'MMORPG',
    'MMO': 'MMO',
    'Survival Horror': 'Survival horror'
  },
  platforms: {
    'PC': 'PC (Microsoft Windows)',
    'Nintendo Switch': 'Nintendo Switch',
    'Nintendo Switch 2': 'Nintendo Switch 2',
    'PlayStation 4': 'PlayStation 4',
    'PlayStation 5': 'PlayStation 5',
    'Xbox One': 'Xbox One',
    'Xbox Series X|S': 'Xbox Series X|S',
    'Nintendo 3DS': 'Nintendo 3DS',
    'New Nintendo 3DS': 'New Nintendo 3DS',
    'Nintendo DS': 'Nintendo DS',
    'PlayStation 3': 'PlayStation 3',
    'PlayStation 2': 'PlayStation 2',
    'PlayStation': 'PlayStation',
    'Xbox 360': 'Xbox 360',
    'Xbox': 'Xbox',
    'Nintendo 64': 'Nintendo 64',
    'Game Boy Advance': 'Game Boy Advance',
    'Game Boy Color': 'Game Boy Color',
    'Game Boy': 'Game Boy',
    'PlayStation Vita': 'PlayStation Vita',
    'PlayStation Portable': 'PlayStation Portable',
    'macOS': 'macOS',
    'Mac': 'Mac',
    'Linux': 'Linux',
    'Android': 'Android',
    'iOS': 'iOS',
    'Arcade': 'Arcade',
    'Google Stadia': 'Google Stadia',
    'Meta Quest 2': 'Meta Quest 2',
    'Oculus Quest': 'Oculus Quest',
    'Oculus Rift': 'Oculus Rift',
    'PlayStation VR2': 'PlayStation VR2',
    'Satellaview': 'Satellaview',
    'SteamVR': 'SteamVR',
    'Super Famicom': 'Super Famicom',
    'Super Nintendo': 'Super Nintendo Entertainment System',
    'Navigateur web': 'Web browser',
    'Wii': 'Wii',
    'Wii U': 'Wii U',
    'Windows Mixed Reality': 'Windows Mixed Reality'
  },
  gameModes: {
    'Solo': 'Single player',
    'Multijoueur': 'Multiplayer',
    'Coopératif': 'Co-operative',
    'Écran partagé': 'Split screen',
    'MMO': 'Massively Multiplayer Online (MMO)',
    'Battle Royale': 'Battle Royale',
    'Coopératif en ligne': 'Online Co-op',
    'Coopératif local': 'Local Co-op',
    'PvP en ligne': 'Online PvP',
    'PvP local': 'Local PvP'
  },
  perspectives: {
    'Vue première personne': 'First person',
    'Vue à la troisième personne': 'Third person',
    'Vue de dessus': 'Bird view',
    'Vue de dessus / Isométrique': 'Bird view / Isometric',
    'Vue de côté': 'Side view',
    'Texte': 'Text',
    'Réalité virtuelle': 'Virtual Reality',
    'Réalité augmentée': 'Augmented Reality',
    'Vue isométrique': 'Isometric',
    'Caméra fixe': 'Fixed camera',
    'Caméra libre': 'Free camera'
  }
};

const FilterContainer: React.FC<FilterContainerProps> = ({ onFiltersChange }) => {
  const [filterData, setFilterData] = useState<FilterData>({});
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    genres: [],
    platforms: [],
    gameModes: [],
    perspectives: []
  });
  const [selectedTranslatedFilters, setSelectedTranslatedFilters] = useState<{ [key: string]: string[] }>({
    genres: [],
    platforms: [],
    gameModes: [],
    perspectives: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/filters`);
        if (response.ok) {
          const data = await response.json();
          setFilterData(data);
        } else {
          console.error('Erreur lors du chargement des filtres');
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleFilterChange = (filterType: string, translatedValues: string[]) => {
    // Convertir les valeurs traduites en valeurs originales pour le filtrage
      const mapping = FILTER_MAPPING[filterType as keyof typeof FILTER_MAPPING];
    const originalValues: string[] = [];
    translatedValues.forEach(translatedValue => {
      const mapped = mapping?.[translatedValue as keyof typeof mapping];
      if (Array.isArray(mapped)) {
        originalValues.push(...(mapped as string[]));
      } else if (mapped) {
        originalValues.push(mapped as string);
      } else {
        originalValues.push(translatedValue);
      }
    });

    const newSelectedFilters = {
      ...selectedFilters,
      [filterType]: originalValues // Stocker les valeurs originales
    };
    
    const newSelectedTranslatedFilters = {
      ...selectedTranslatedFilters,
      [filterType]: translatedValues // Stocker les valeurs traduites pour l'affichage
    };
    
    setSelectedFilters(newSelectedFilters);
    setSelectedTranslatedFilters(newSelectedTranslatedFilters);
    onFiltersChange(newSelectedFilters);
  };

  if (loading) {
    return (
      <div className="filter-container">
        <LoadingSkeleton type="filter-card" />
        <LoadingSkeleton type="filter-card" />
        <LoadingSkeleton type="filter-card" />
        <LoadingSkeleton type="filter-card" />
      </div>
    );
  }

  return (
    <div className="filter-container">
      {Object.entries(filterData).map(([filterType, data]) => (
        <FilterCard
          key={filterType}
          label={data.label}
          values={data.values}
          selectedValues={selectedTranslatedFilters[filterType] || []}
          onChange={(values) => handleFilterChange(filterType, values)}
          maxVisibleItems={filterType === 'platforms' ? 8 : 6} // Plus d'items visibles pour les plateformes
        />
      ))}
    </div>
  );
};

export default FilterContainer; 