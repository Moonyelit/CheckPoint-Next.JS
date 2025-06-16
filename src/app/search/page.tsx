"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./search.scss";
import ResultsGame from "./components/resultsGame";

interface Game {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
  first_release_date?: number;
  platforms?: Array<{
    name: string;
  }>;
  total_rating?: number;
}

interface PaginationInfo {
  currentPage: number;
  limit: number;
  offset: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    limit: 30,
    offset: 0
  });

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games/search/${encodeURIComponent(query)}?page=${page}`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de la recherche");
        return res.json();
      })
      .then(data => {
        console.log('Données reçues:', data);
        if (Array.isArray(data.games)) {
          setGames(data.games);
          setPagination(data.pagination);
        } else {
          setGames([]);
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [query, page]);

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="search-page main-container">
      <h1 className="search-page__title">Jeux</h1>
      {loading && <div>Chargement...</div>}
      {error && <div className="search-page__error">{error}</div>}
      <section className="search-page__results">
        {games.length === 0 && !loading && !error && <div>Aucun jeu trouvé.</div>}
        {games.map(game => (
          <ResultsGame
            key={game.id}
            title={game.name}
            coverUrl={game.cover?.url ? `https:${game.cover.url}` : undefined}
            platforms={game.platforms?.map(p => p.name)}
            score={game.total_rating}
          />
        ))}
      </section>
      {games.length > 0 && (
        <div className="search-page__pagination">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="search-page__pagination-button"
          >
            Précédent
          </button>
          <span className="search-page__pagination-info">
            Page {pagination.currentPage}
          </span>
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={games.length < pagination.limit}
            className="search-page__pagination-button"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}