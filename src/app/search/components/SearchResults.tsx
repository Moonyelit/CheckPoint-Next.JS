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
  slug?: string;
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
      {games.map((game, index) => {
        const title = game.name ?? game.title ?? "Titre inconnu";
        const coverUrl = game.cover?.url ?? game.coverUrl;
        const score = game.total_rating ?? game.totalRating;
        
        // Génération d'un slug pour tous les jeux
        let slug = game.slug;
        if (!slug && title) {
          // Génération d'un slug basique pour les jeux d'IGDB
          slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        
        // Si toujours pas de slug, utiliser l'ID comme fallback
        if (!slug) {
          slug = `game-${game.id}`;
          console.warn(`Jeu sans titre ni slug, utilisation de l'ID : ${game.id}`);
        }

        // Log pour debug
        console.log(`Rendu jeu ${index + 1}:`, {
          id: game.id,
          title,
          slug,
          coverUrl: coverUrl ? 'Oui' : 'Non',
          score
        });

        return (
          <ResultsGame
            key={game.id}
            slug={slug}
            title={title}
            coverUrl={coverUrl}
            platforms={
              game.platforms?.map((p) =>
                typeof p === "string" ? p : p.name
              ) ?? []
            }
            score={score}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        );
      })}
    </div>
  );
};

export default SearchResults; 