import React, { useState, useRef, useEffect } from "react";
import "../styles/sortingDropdown.scss";

export type SortOption = "note" | "releaseDate" | "name";
export type SortDirection = "asc" | "desc";

interface SortingDropdownProps {
  onSort: (option: SortOption, direction: SortDirection) => void;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({ onSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SortOption>("note");
  const [direction, setDirection] = useState<SortDirection>("desc");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gestion du clavier
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const getOptionLabel = (option: SortOption): string => {
    switch (option) {
      case "note":
        return "Note";
      case "releaseDate":
        return "Date de sortie";
      case "name":
        return "Nom";
    }
  };

  const handleOptionSelect = (option: SortOption) => {
    if (option === selectedOption) {
      // Si même option, on inverse juste la direction
      const newDirection = direction === "asc" ? "desc" : "asc";
      setDirection(newDirection);
      onSort(option, newDirection);
    } else {
      // Nouvelle option, on garde la direction actuelle
      setSelectedOption(option);
      onSort(option, direction);
    }
    setIsOpen(false);
  };

  const toggleDirection = () => {
    const newDirection = direction === "asc" ? "desc" : "asc";
    setDirection(newDirection);
    onSort(selectedOption, newDirection);
  };

  // Fonction pour déterminer la classe CSS selon la direction
  const getDirectionClass = () => {
    // Pour les notes et dates : on inverse la logique CSS pour que la rotation fonctionne
    if (selectedOption === "note" || selectedOption === "releaseDate") {
      return direction === "desc" ? "asc" : "desc";
    }
    // Pour le nom : logique normale
    return direction;
  };

  return (
    <div className="sorting-dropdown" ref={dropdownRef} role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" aria-controls="sorting-options">
      <div 
        className="sorting-header" 
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-label={`Trier par ${getOptionLabel(selectedOption)}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span>Trier par : {getOptionLabel(selectedOption)}</span>
        <button 
          className={`direction-button ${getDirectionClass()}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleDirection();
          }}
          aria-label={`Changer la direction de tri (actuellement ${direction === 'asc' ? 'croissant' : 'décroissant'})`}
          type="button"
        >
          <i className="bx bx-chevron-up" aria-hidden="true"></i>
        </button>
      </div>
      {isOpen && (
        <div id="sorting-options" className="sorting-options" role="listbox" aria-label="Options de tri">
          {["note", "releaseDate", "name"].map((option) => (
            <button
              key={option}
              className={`sort-option ${selectedOption === option ? "active" : ""}`}
              onClick={() => handleOptionSelect(option as SortOption)}
              role="option"
              aria-selected={selectedOption === option}
              type="button"
            >
              {getOptionLabel(option as SortOption)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortingDropdown; 