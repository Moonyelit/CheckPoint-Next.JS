"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./search.scss";
import SearchBar from "./components/searchbar";
import FilterContainer from "./components/FilterContainer";
import SearchResults from "./components/SearchResults";
import Pagination from "./components/Pagination";

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
  genres?: (string | { name: string })[];
  gameModes?: (string | { name: string })[];
  perspectives?: (string | { name: string })[];
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
    offset: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    genres: [],
    platforms: [],
    gameModes: [],
    perspectives: [],
  });

  // Fonction pour filtrer les jeux selon les critères sélectionnés
  const filterGames = (games: ApiGame[], activeFilters: Filters): ApiGame[] => {
    return games.filter(game => {
      // Filtrage par genres
      if (activeFilters.genres.length > 0) {
        const gameGenres = game.genres || [];
        const hasMatchingGenre = activeFilters.genres.some(selectedGenre =>
          gameGenres.some(gameGenre => 
            typeof gameGenre === 'string' 
              ? gameGenre.toLowerCase().includes(selectedGenre.toLowerCase())
              : gameGenre.name?.toLowerCase().includes(selectedGenre.toLowerCase())
          )
        );
        if (!hasMatchingGenre) return false;
      }

      // Filtrage par plateformes
      if (activeFilters.platforms.length > 0) {
        const gamePlatforms = game.platforms || [];
        const hasMatchingPlatform = activeFilters.platforms.some(selectedPlatform =>
          gamePlatforms.some(gamePlatform => 
            typeof gamePlatform === 'string' 
              ? gamePlatform.toLowerCase().includes(selectedPlatform.toLowerCase())
              : gamePlatform.name?.toLowerCase().includes(selectedPlatform.toLowerCase())
          )
        );
        if (!hasMatchingPlatform) return false;
      }

      // Filtrage par modes de jeu
      if (activeFilters.gameModes.length > 0) {
        const gameModes = game.gameModes || [];
        const hasMatchingGameMode = activeFilters.gameModes.some(selectedMode =>
          gameModes.some(gameMode => 
            typeof gameMode === 'string' 
              ? gameMode.toLowerCase().includes(selectedMode.toLowerCase())
              : gameMode.name?.toLowerCase().includes(selectedMode.toLowerCase())
          )
        );
        if (!hasMatchingGameMode) return false;
      }

      // Filtrage par perspectives
      if (activeFilters.perspectives.length > 0) {
        const gamePerspectives = game.perspectives || [];
        const hasMatchingPerspective = activeFilters.perspectives.some(selectedPerspective =>
          gamePerspectives.some(gamePerspective => 
            typeof gamePerspective === 'string' 
              ? gamePerspective.toLowerCase().includes(selectedPerspective.toLowerCase())
              : gamePerspective.name?.toLowerCase().includes(selectedPerspective.toLowerCase())
          )
        );
        if (!hasMatchingPerspective) return false;
      }

      return true;
    });
  };

  // État pour les jeux filtrés
  const [filteredGames, setFilteredGames] = useState<ApiGame[]>([]);

  // Appliquer les filtres quand les jeux ou les filtres changent
  useEffect(() => {
    const filtered = filterGames(games, filters);
    setFilteredGames(filtered);
  }, [games, filters]);

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
        .then((res) => {
          if (!res.ok)
            throw new Error(
              "Erreur lors de la récupération des jeux populaires"
            );
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setGames(data);
            setPagination({
              currentPage: 1,
              limit: 100,
              offset: 0,
              totalCount: data.length,
            });
          } else if (data && Array.isArray(data.member)) {
            setGames(data.member);
            setPagination({
              currentPage: 1,
              limit: 100,
              offset: 0,
              totalCount:
                data["hydra:totalItems"] ||
                data.totalItems ||
                data.member.length,
            });
          } else {
            setGames([]);
          }
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
      return;
    }

    // Sinon, on utilise la recherche normale
    const searchUrl = `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/games/search/${encodeURIComponent(query)}?page=${page}&limit=20`;
    fetch(searchUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la recherche");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.games)) {
          setGames(data.games);
          setPagination(data.pagination);
        } else {
          setGames([]);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query, page]);

  const handleFiltersChange = (newFilters: { [key: string]: string[] }) => {
    // Conversion sécurisée des filtres
    const convertedFilters: Filters = {
      genres: newFilters.genres || [],
      platforms: newFilters.platforms || [],
      gameModes: newFilters.gameModes || [],
      perspectives: newFilters.perspectives || [],
    };

    setFilters(convertedFilters);
  };

  const totalPages = Math.ceil((pagination.totalCount || 0) / pagination.limit);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", newPage.toString());
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${searchParams.toString()}`
    );
    window.dispatchEvent(new Event("popstate"));
  };

  const handleSearch = (newQuery: string) => {
    if (newQuery && newQuery !== query) {
      const params = new URLSearchParams(window.location.search);
      params.set("query", newQuery);
      params.set("page", "1");
      window.location.search = params.toString();
    }
  };

  return (
    <div className="search-page main-container">
      <h1 className="search-page__title">Jeux</h1>

      <div className="search-page__content">
        <aside className="search-page__filters">
          <FilterContainer onFiltersChange={handleFiltersChange} />
        </aside>
        <main className="search-page__main">
          <SearchBar
            initialQuery={
              query === "top100_games" || query === "top_year_games"
                ? ""
                : query
            }
            onSearch={handleSearch}
          />

          <SearchResults games={filteredGames} loading={loading} error={error} />

          {/* Message indiquant le nombre de résultats */}
          {!loading && !error && (
            <div className="search-results-info">
              {filters.genres.length > 0 || filters.platforms.length > 0 || filters.gameModes.length > 0 || filters.perspectives.length > 0 ? (
                <p>
                  {filteredGames.length} résultat{filteredGames.length > 1 ? 's' : ''} trouvé{filteredGames.length > 1 ? 's' : ''} 
                  {games.length !== filteredGames.length && (
                    <span> (sur {games.length} jeu{games.length > 1 ? 'x' : ''} au total)</span>
                  )}
                </p>
              ) : (
                <p>{filteredGames.length} jeu{filteredGames.length > 1 ? 'x' : ''} trouvé{filteredGames.length > 1 ? 's' : ''}</p>
              )}
            </div>
          )}

          {filteredGames.length > 0 && totalPages > 1 && (
            <Pagination
              pagination={pagination}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              query={query}
            />
          )}
        </main>
      </div>
    </div>
  );
}
