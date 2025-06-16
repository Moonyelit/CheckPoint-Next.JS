"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./search.scss";
import ResultsGame from "./components/resultsGame";
import 'boxicons/css/boxicons.min.css';

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
  totalCount?: number;
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
    limit: 20,
    offset: 0
  });

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games/search/${encodeURIComponent(query)}?page=${page}&limit=20`)
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

  const totalPages = Math.ceil((pagination.totalCount || 0) / pagination.limit);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
    // Pour forcer le rechargement du composant
    window.dispatchEvent(new Event('popstate'));
  };

  // Génération intelligente des numéros de pages
  const renderPageNumbers = () => {
    const pages = [];
    const { currentPage } = pagination;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // Toujours afficher la première page
    if (startPage > 1 || currentPage === 1) {
      pages.push(
        <button
          key={1}
          className={`search-page__pagination-number${currentPage === 1 ? ' active' : ''}`}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="search-page__pagination-ellipsis">...</span>);
      }
    }

    // Affiche les pages autour de la page courante (hors 1 et dernière)
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(
          <button
            key={i}
            className={`search-page__pagination-number${currentPage === i ? ' active' : ''}`}
            onClick={() => handlePageChange(i)}
            disabled={currentPage === i}
          >
            {i}
          </button>
        );
      }
    }

    // Toujours afficher la dernière page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="search-page__pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className={`search-page__pagination-number${currentPage === totalPages ? ' active' : ''}`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
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
      {games.length > 0 && totalPages > 1 && (
        <div className="search-page__pagination">
          <button
            className="search-page__pagination-button"
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
            aria-label="Première page"
          >
            <i className='bx bx-chevrons-left'></i>
          </button>
          <button
            className="search-page__pagination-button"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            aria-label="Page précédente"
          >
            <i className='bx bx-chevron-left'></i>
          </button>
          {renderPageNumbers()}
          <button
            className="search-page__pagination-button"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === totalPages}
            aria-label="Page suivante"
          >
            <i className='bx bx-chevron-right'></i>
          </button>
          <button
            className="search-page__pagination-button"
            onClick={() => handlePageChange(totalPages)}
            disabled={pagination.currentPage === totalPages}
            aria-label="Dernière page"
          >
            <i className='bx bx-chevrons-right'></i>
          </button>
        </div>
      )}
    </div>
  );
}