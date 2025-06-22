import React from "react";
import ResultsGame from "./resultsGame";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
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
    return <LoadingSkeleton type="search-results" count={6} />;
  }

  if (error) {
    return (
      <div className="search-page__error">
        <i className="bx bx-error-circle"></i>
        <p>Erreur : {error}</p>
        <button onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="search-page__no-results">
        <i className="bx bx-search-alt"></i>
        <p>Aucun jeu ne correspond à vos critères.</p>
        <p>Essayez de modifier vos filtres ou votre recherche.</p>
      </div>
    );
  }

  return (
    <div className="search-results-container animate-in">
      {games.map((game, index) => (
        <ResultsGame
          key={game.id}
          title={game.name ?? game.title ?? "Titre inconnu"}
          coverUrl={game.cover?.url ?? game.coverUrl}
          platforms={(game.platforms as any)?.map((p: any) => p.name ?? p) ?? []}
          score={game.total_rating ?? game.totalRating}
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default SearchResults; 