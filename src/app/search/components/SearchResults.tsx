import React from "react";
import ResultsGame from "./resultsGame";

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
    return <div className="search-page__loading">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="search-page__error">{error}</div>;
  }

  if (games.length === 0) {
    return <div className="search-page__no-results">Aucun jeu trouvé.</div>;
  }

  return (
    <section className="search-page__results">
      {games.map(game => (
        <ResultsGame
          key={game.id}
          title={game.title || game.name || ''}
          coverUrl={game.coverUrl ? (game.coverUrl.startsWith('http') ? game.coverUrl : `https:${game.coverUrl}`) : (game.cover && game.cover.url ? `https:${game.cover.url}` : undefined)}
          platforms={game.platforms?.map(p => typeof p === 'string' ? p : p.name) || []}
          score={game.totalRating ?? game.total_rating}
        />
      ))}
    </section>
  );
};

export default SearchResults; 