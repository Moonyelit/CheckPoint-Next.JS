import React, { useState } from "react";
import "../styles/searchbar.scss";

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = "", onSearch }) => {
  const [input, setInput] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Rechercher votre jeu"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button type="submit">
        <i className="bx bx-search"></i>
      </button>
    </form>
  );
};

export default SearchBar;
