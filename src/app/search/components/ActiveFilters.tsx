import React from "react";

interface Filters {
  genres: string[];
  platforms: string[];
  gameModes: string[];
  perspectives: string[];
}

interface ActiveFiltersProps {
  filters: Filters;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters }) => {
  const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0);

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="search-page__active-filters">
      <h3>Filtres actifs :</h3>
      {filters.genres.length > 0 && (
        <div>Genres : {filters.genres.join(', ')}</div>
      )}
      {filters.platforms.length > 0 && (
        <div>Plateformes : {filters.platforms.join(', ')}</div>
      )}
      {filters.gameModes.length > 0 && (
        <div>Modes de jeu : {filters.gameModes.join(', ')}</div>
      )}
      {filters.perspectives.length > 0 && (
        <div>Perspectives : {filters.perspectives.join(', ')}</div>
      )}
    </div>
  );
};

export default ActiveFilters; 