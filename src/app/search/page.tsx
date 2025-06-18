"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./search.scss";
import ResultsGame from "./components/resultsGame";
import 'boxicons/css/boxicons.min.css';
import SearchBar from "./components/searchbar";
import FilterContainer from "./components/FilterContainer";

// Définition d'un type générique pour les jeux reçus de l'API
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

interface PaginationInfo {
  currentPage: number;
  limit: number;
  offset: number;
  totalCount?: number;
}

interface Filters {
  genres: string[];
  platforms: string[];
  gameModes: string[];
  perspectives: string[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const [games, setGames] = useState<ApiGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    limit: 20,
    offset: 0
  });
  const [filters, setFilters] = useState<Filters>({
    genres: [],
    platforms: [],
    gameModes: [],
    perspectives: []
  });

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);

    let apiUrl = "";
    if (query === "top100_games") {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games/top100?limit=100`;
    } else if (query === "top_year_games") {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games/top100-year?limit=100`;
    }

    if (apiUrl) {
      fetch(apiUrl)
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de la récupération des jeux populaires");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setGames(data);
            setPagination({
              currentPage: 1,
              limit: 100,
              offset: 0,
              totalCount: data.length
            });
          } else if (data && Array.isArray(data.member)) {
            setGames(data.member);
            setPagination({
              currentPage: 1,
              limit: 100,
              offset: 0,
              totalCount: data['hydra:totalItems'] || data.totalItems || data.member.length
            });
          } else {
            setGames([]);
          }
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
      return;
    }

    // Sinon, on utilise la recherche normale
    const searchUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games/search/${encodeURIComponent(query)}?page=${page}&limit=20`;
    fetch(searchUrl)
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de la recherche");
        return res.json();
      })
      .then(data => {
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

  const handleFiltersChange = (newFilters: { [key: string]: string[] }) => {
    // Conversion sécurisée des filtres
    const convertedFilters: Filters = {
      genres: newFilters.genres || [],
      platforms: newFilters.platforms || [],
      gameModes: newFilters.gameModes || [],
      perspectives: newFilters.perspectives || []
    };
    
    setFilters(convertedFilters);
    
    // Logique de filtrage basique (à implémenter selon vos besoins)
    const hasActiveFilters = Object.values(convertedFilters).some(filterArray => filterArray.length > 0);
    if (hasActiveFilters) {
      console.log('Filtres actifs détectés:', convertedFilters);
      // Ici vous pouvez ajouter la logique pour filtrer les jeux
      // Par exemple : filtrerGames(convertedFilters);
    }
  };

  const totalPages = Math.ceil((pagination.totalCount || 0) / pagination.limit);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
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
      <div className="search-page__content">
        <aside className="search-page__filters">
          <h1 className="search-page__title">Jeux</h1>
          <FilterContainer onFiltersChange={handleFiltersChange} />
        </aside>
        <main className="search-page__main">
          <SearchBar
            initialQuery={query === "top100_games" || query === "top_year_games" ? "" : query}
            onSearch={newQuery => {
              if (newQuery && newQuery !== query) {
                const params = new URLSearchParams(window.location.search);
                params.set("query", newQuery);
                params.set("page", "1");
                window.location.search = params.toString();
              }
            }}
          />
          {loading && <div className="search-page__loading">Chargement en cours...</div>}
          {error && <div className="search-page__error">{error}</div>}
          
          {/* Affichage des filtres actifs */}
          {Object.values(filters).some(filterArray => filterArray.length > 0) && (
            <div className="search-page__active-filters">
              <h3>Filtres actifs :</h3>
              {filters.genres.length > 0 && (
                <div>Genres : {filters.genres.join(', ')}</div>
              )}
              {filters.platforms.length > 0 && (
                <div>Plateformes : {filters.platforms.join(', ')}</div>
              )}
              {filters.gameModes.length > 0 && (
                <div>Modes de jeu : {filters.gameModes.join(', ')}</div>
              )}
              {filters.perspectives.length > 0 && (
                <div>Perspectives : {filters.perspectives.join(', ')}</div>
              )}
            </div>
          )}
          
          <section className="search-page__results">
            {games.length === 0 && !loading && !error && <div>Aucun jeu trouvé.</div>}
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
          {games.length > 0 && totalPages > 1 && query !== "top_year_games" && (
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
        </main>
      </div>
    </div>
  );
}