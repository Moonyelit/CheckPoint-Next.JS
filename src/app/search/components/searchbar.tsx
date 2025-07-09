import React, { useState, useEffect } from "react";
import "../styles/searchbar.scss";

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = "", onSearch }) => {
  const [input, setInput] = useState(initialQuery);
  const [error, setError] = useState<string | null>(null);

  // Synchronise l'input avec la prop initialQuery (reset si besoin)
  useEffect(() => {
    setInput(initialQuery);
  }, [initialQuery]);

  // 🛡️ VALIDATION DE SÉCURITÉ - Protection contre les injections
  const validateSearchQuery = (query: string): boolean => {
    // Vider les erreurs précédentes
    setError(null);

    // Vérifier la longueur minimale
    if (query.trim().length < 2) {
      setError("La recherche doit contenir au moins 2 caractères");
      return false;
    }

    // Vérifier la longueur maximale
    if (query.length > 100) {
      setError("La recherche ne peut pas dépasser 100 caractères");
      return false;
    }

    // Vérifier les caractères dangereux
    const dangerousPattern = /[<>"'&]/;
    if (dangerousPattern.test(query)) {
      setError("La recherche contient des caractères non autorisés");
      return false;
    }

    // Vérifier les caractères de contrôle
    const controlPattern = /[\x00-\x1F\x7F]/;
    if (controlPattern.test(query)) {
      setError("La recherche contient des caractères de contrôle non autorisés");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedQuery = input.trim();
    
    // Validation de sécurité
    if (!validateSearchQuery(trimmedQuery)) {
      return;
    }

    // Nettoyer la requête avant l'envoi
    const sanitizedQuery = trimmedQuery
      .replace(/[<>"'&]/g, '') // Supprimer les caractères dangereux
      .replace(/\s+/g, ' ') // Normaliser les espaces
      .substring(0, 100); // Limiter la longueur

    onSearch(sanitizedQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    
    // Valider en temps réel et effacer l'erreur si valide
    if (error && validateSearchQuery(value)) {
      setError(null);
    }
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <div className="searchbar__input-container">
        <input
          type="text"
          placeholder="Rechercher votre jeu"
          value={input}
          onChange={handleInputChange}
          maxLength={100}
          aria-describedby={error ? "search-error" : undefined}
        />
        <button type="submit" disabled={!!error}>
          <i className="bx bx-search"></i>
        </button>
      </div>
      {error && (
        <div id="search-error" className="searchbar__error" role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
