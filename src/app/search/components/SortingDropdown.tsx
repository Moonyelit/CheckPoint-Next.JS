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

  return (
    <div className="sorting-dropdown" ref={dropdownRef}>
      <div className="sorting-header" onClick={() => setIsOpen(!isOpen)}>
        <span>Trier par : {getOptionLabel(selectedOption)}</span>
        <button 
          className={`direction-button ${direction === "asc" ? "asc" : "desc"}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleDirection();
          }}
        >
          <i className="bx bx-chevron-up"></i>
        </button>
      </div>
      {isOpen && (
        <div className="sorting-options">
          {["note", "releaseDate", "name"].map((option) => (
            <button
              key={option}
              className={`sort-option ${selectedOption === option ? "active" : ""}`}
              onClick={() => handleOptionSelect(option as SortOption)}
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