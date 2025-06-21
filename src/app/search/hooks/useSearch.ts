/**
 * ==========================================================================
 * USE SEARCH HOOK - Hook personnalisé pour la gestion de la recherche
 * ==========================================================================
 * 
 * Ce hook gère toute la logique d'état et les interactions utilisateur pour :
 * - Récupération des données depuis l'API (recherche, top100, top year)
 * - Gestion des filtres et du tri côté client
 * - Pagination des résultats
 * - Synchronisation avec l'URL pour la navigation
 * - Debouncing des requêtes API (300ms)
 * 
 * Le hook utilise useMemo pour optimiser les performances en évitant
 * les recalculs inutiles lors des re-renders.
 * ==========================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiGame, Filters, PaginationInfo, SortState } from '../types';
import { filterGames, sortGames } from '../lib/game-logic';
import { SortDirection, SortOption } from '../components/SortingDropdown';

// Délai de debouncing pour éviter les appels API trop fréquents
const DEBOUNCE_TIME = 300; // 300ms

export function useSearch() {
  // ==========================================================================
  // ÉTAT DE L'URL - Synchronisation avec les paramètres de l'URL
  // ==========================================================================
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || ''; // Requête de recherche depuis l'URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1'); // Page depuis l'URL

  // ==========================================================================
  // ÉTAT DES DONNÉES API - Gestion des données récupérées depuis l'API
  // ==========================================================================
  const [games, setGames] = useState<ApiGame[]>([]); // Liste complète des jeux
  const [pagination, setPagination] = useState<PaginationInfo>({ currentPage: 1, limit: 20, offset: 0 }); // Info de pagination
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState<string | null>(null); // Messages d'erreur

  // ==========================================================================
  // ÉTAT DE L'INTERFACE - Gestion des interactions utilisateur
  // ==========================================================================
  const [filters, setFilters] = useState<Filters>({ genres: [], platforms: [], gameModes: [], perspectives: [] }); // Filtres actifs
  const [sort, setSort] = useState<SortState>({ option: 'note', direction: 'desc' }); // État du tri
  const [clientCurrentPage, setClientCurrentPage] = useState(1); // Page courante côté client
  const [sortKey, setSortKey] = useState(0); // Clé pour forcer le re-render lors du tri

  // ==========================================================================
  // EFFET DE RÉCUPÉRATION DES DONNÉES - Appels API avec debouncing
  // ==========================================================================
  useEffect(() => {
    if (!query) return; // Pas de requête = pas d'appel API

    // Debouncing : attend 300ms avant de faire l'appel API
    const handler = setTimeout(() => {
        setLoading(true);
        setError(null);

        // Construction de l'URL selon le type de requête
        let apiUrl = '';
        if (query === 'top100_games') {
          // Récupération des 100 meilleurs jeux
          apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games/top100?limit=100`;
        } else if (query === 'top_year_games') {
          // Récupération des meilleurs jeux de l'année
          apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games/top100-year?limit=100`;
        }

        // Appel API pour les jeux populaires
        if (apiUrl) {
          fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
              const gamesData = data.member ?? data;
              setGames(Array.isArray(gamesData) ? gamesData : []);
              setPagination({ currentPage: 1, limit: 20, offset: 0, totalCount: gamesData.length });
            })
            .catch(e => {
              console.error("Erreur lors de la récupération des jeux populaires:", e);
              setError('Erreur de chargement des jeux populaires.');
            })
            .finally(() => setLoading(false));
          return;
        }

        // Appel API pour la recherche de jeux
        const searchUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games/search/${encodeURIComponent(query)}?page=${pageFromUrl}&limit=20`;
        fetch(searchUrl)
          .then(res => res.json())
          .then(data => {
            setGames(data.games ?? []);
            setPagination(data.pagination);
          })
          .catch(e => {
            console.error("Erreur lors de la recherche de jeux:", e);
            setError('Erreur de recherche.');
          })
          .finally(() => setLoading(false));
    }, DEBOUNCE_TIME);

    // Nettoyage du timeout si la requête change
    return () => clearTimeout(handler);
  }, [query, pageFromUrl]);
  
  // ==========================================================================
  // PIPELINE DE TRAITEMENT DES DONNÉES - Filtrage, tri et pagination
  // ==========================================================================
  
  // Filtrage des jeux selon les critères sélectionnés
  const filteredGames = useMemo(() => filterGames(games, filters), [games, filters]);
  
  // Tri des jeux filtrés selon l'option et la direction
  const sortedGames = useMemo(() => sortGames(filteredGames, sort), [filteredGames, sort]);
  
  // Calcul du nombre total de pages
  const totalPages = useMemo(() => Math.ceil(sortedGames.length / pagination.limit), [sortedGames, pagination.limit]);

  // Pagination : découpage des jeux pour afficher seulement la page courante
  const paginatedGames = useMemo(() => {
    const offset = (clientCurrentPage - 1) * pagination.limit;
    return sortedGames.slice(offset, offset + pagination.limit);
  }, [sortedGames, clientCurrentPage, pagination.limit]);

  // ==========================================================================
  // GESTIONNAIRES D'ÉVÉNEMENTS - Fonctions pour les interactions utilisateur
  // ==========================================================================
  
  /**
   * Gestionnaire de changement de filtres
   * Met à jour les filtres actifs et remet la pagination à la première page
   * @param newFilters - Nouveaux filtres sélectionnés par l'utilisateur
   */
  const handleFiltersChange = (newFilters: { [key: string]: string[] }) => {
    setFilters({
        genres: newFilters.genres || [],
        platforms: newFilters.platforms || [],
        gameModes: newFilters.gameModes || [],
        perspectives: newFilters.perspectives || [],
    });
    setClientCurrentPage(1); // Retour à la première page lors du filtrage
  };

  /**
   * Gestionnaire de changement de tri
   * Met à jour l'option et la direction de tri, force le re-render
   * @param option - Option de tri (note, date, nom)
   * @param direction - Direction du tri (ascendant/descendant)
   */
  const handleSort = (option: SortOption, direction: SortDirection) => {
    setSort({ option, direction });
    setSortKey(key => key + 1); // Force le re-render des résultats
    setClientCurrentPage(1); // Retour à la première page lors du tri
  };

  /**
   * Gestionnaire de changement de page
   * Met à jour la page courante et scroll vers le haut
   * @param newPage - Numéro de la nouvelle page
   */
  const handlePageChange = (newPage: number) => {
    setClientCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll vers le haut de la page
  };
  
  /**
   * Gestionnaire de recherche
   * Met à jour l'URL avec la nouvelle requête pour la navigation
   * @param newQuery - Nouvelle requête de recherche
   */
  const handleSearch = (newQuery: string) => {
    if (newQuery.trim() !== query) {
      window.location.search = `?query=${encodeURIComponent(newQuery.trim())}&page=1`;
    }
  };

  // ==========================================================================
  // RETOUR DU HOOK - Valeurs et fonctions exposées au composant
  // ==========================================================================
  return {
    query,                    // Requête actuelle
    loading,                  // État de chargement
    error,                    // Message d'erreur
    paginatedGames,           // Jeux de la page courante
    totalPages,               // Nombre total de pages
    sortKey,                  // Clé pour forcer le re-render
    clientCurrentPage,        // Page courante côté client
    pagination,               // Informations de pagination
    handleFiltersChange,      // Gestionnaire de filtres
    handleSort,               // Gestionnaire de tri
    handlePageChange,         // Gestionnaire de pagination
    handleSearch,             // Gestionnaire de recherche
  };
} 