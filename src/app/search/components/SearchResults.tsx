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
  console.log('[DEBUG] SearchResults rendu, jeux reçus:', games);
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

  // Patch debug avancé : log structure détaillée et détection Promise/fonction/objet complexe
  const isPlainSerializable = (obj) => {
    if (typeof obj !== 'object' || obj === null) return true;
    for (const key in obj) {
      const val = obj[key];
      if (typeof val === 'function') {
        console.error(`[DEBUG] Champ fonction détecté dans le jeu (clé: ${key})`, obj);
        return false;
      }
      if (val instanceof Promise) {
        console.error(`[DEBUG] Champ Promise détecté dans le jeu (clé: ${key})`, obj);
        return false;
      }
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        // Autorise les objets cover {url: ...} mais pas d'objet complexe
        if (key === 'cover' && val && typeof val.url === 'string') continue;
        // Log l'objet complexe
        console.error(`[DEBUG] Champ objet complexe détecté (clé: ${key})`, val, 'dans', obj);
        return false;
      }
    }
    return true;
  };

  const filteredGames = games.filter((game, idx) => {
    const ok = isPlainSerializable(game);
    if (!ok) {
      console.warn('[DEBUG] Jeu filtré car non sérialisable pour React:', game, 'à l\'index', idx);
    }
    // Log structure détaillée de chaque jeu
    console.log('[DEBUG] Structure détaillée jeu', idx, JSON.stringify(game, null, 2));
    return ok;
  });

  return (
    <div className="search-results-container animate-in">
      {filteredGames
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