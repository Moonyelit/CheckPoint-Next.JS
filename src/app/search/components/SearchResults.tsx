import React from "react";
import ResultsGame from "./resultsGame";
import "../styles/searchResults.scss";

interface ApiGame {
  id: number;
  title?: string;
  name?: string;
  coverUrl?: string;
  cover?: { url: string };
  platforms?: (string | { name: string })[];
  totalRating?: number;
  total_rating?: number;
}

interface SearchResultsProps {
  games: ApiGame[];
  loading: boolean;
  error: string | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ games, loading, error }) => {
  if (loading) {
    return <div className="search-page__loading">Chargement des jeux...</div>;
  }

  if (error) {
    return <div className="search-page__error">Erreur : {error}</div>;
  }

  if (games.length === 0) {
    return (
      <div className="search-page__no-results">
        Aucun jeu ne correspond à vos critères.
      </div>
    );
  }

  return (
    <div className="search-results-container animate-in">
      {games.map((game) => (
        <ResultsGame
          key={game.id}
          title={game.name ?? game.title ?? "Titre inconnu"}
          coverUrl={game.cover?.url ?? game.coverUrl}
          platforms={(game.platforms as any)?.map((p: any) => p.name ?? p) ?? []}
          score={game.total_rating ?? game.totalRating}
        />
      ))}
    </div>
  );
};

export default SearchResults; 