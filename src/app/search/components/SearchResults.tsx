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
  igdbId?: number;
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

  // Correction : garantir l'unicité des clés React
  const usedKeys = new Set();

  return (
    <div className="search-results-container animate-in">
      {games
        .filter(game => {
          // Validation des données : filtrer les jeux invalides
          if (!game || typeof game !== 'object') return false;
          // Accepte si id (local), ou igdbId (IGDB), ou slug (fallback)
          if (
            (!game.id || typeof game.id !== 'number') &&
            (!game.igdbId || typeof game.igdbId !== 'number') &&
            (!game.slug || typeof game.slug !== 'string' || game.slug.trim() === '')
          ) return false;
          const title = game.name ?? game.title;
          if (!title || typeof title !== 'string' || title.trim() === '') return false;
          return true;
        })
        .map((game, index) => {
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

          // Génération d'une clé unique pour React
          let uniqueKey =
            (game.id && `db-${game.id}`) ||
            (game.igdbId && `igdb-${game.igdbId}`) ||
            (slug && `slug-${slug}-${index}`) ||
            `fallback-${index}`;

          // Correction : si la clé existe déjà, on ajoute l'index pour la rendre unique
          if (usedKeys.has(uniqueKey)) {
            uniqueKey = `${uniqueKey}-${index}`;
          }
          usedKeys.add(uniqueKey);

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
              key={uniqueKey}
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