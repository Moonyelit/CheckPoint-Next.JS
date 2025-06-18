import React, { useState, useEffect } from "react";
import FilterCard from "./FilterCard";

interface FilterData {
  [key: string]: {
    label: string;
    values: string[];
  };
}

interface FilterContainerProps {
  onFiltersChange: (filters: { [key: string]: string[] }) => void;
}

const FilterContainer: React.FC<FilterContainerProps> = ({ onFiltersChange }) => {
  const [filterData, setFilterData] = useState<FilterData>({});
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
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

  const handleFilterChange = (filterType: string, values: string[]) => {
    const newSelectedFilters = {
      ...selectedFilters,
      [filterType]: values
    };
    setSelectedFilters(newSelectedFilters);
    onFiltersChange(newSelectedFilters);
  };

  if (loading) {
    return (
      <div className="filter-container">
        <div className="filter-loading">Chargement des filtres...</div>
      </div>
    );
  }

  return (
    <div className="filter-container">
      {Object.entries(filterData).map(([filterType, data]) => (
        <FilterCard
          key={filterType}
          filterType={filterType}
          label={data.label}
          values={data.values}
          selectedValues={selectedFilters[filterType] || []}
          onChange={(values) => handleFilterChange(filterType, values)}
          maxVisibleItems={filterType === 'platforms' ? 8 : 6} // Plus d'items visibles pour les plateformes
        />
      ))}
    </div>
  );
};

export default FilterContainer; 