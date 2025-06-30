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
 * - Debouncing des requêtes API (200ms)
 * - Cache des résultats pour éviter les requêtes répétées
 * 
 * Le hook utilise useMemo pour optimiser les performances en évitant
 * les recalculs inutiles lors des re-renders.
 * ==========================================================================
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiGame, Filters, PaginationInfo, SortState } from '../types';
import { filterGames, sortGames } from '../lib/game-logic';
import { SortDirection, SortOption } from '../components/SortingDropdown';

// Délai de debouncing réduit pour une meilleure réactivité
const DEBOUNCE_TIME = 200; // 200ms au lieu de 300ms

// Cache simple pour éviter les requêtes répétées
interface CacheData {
  member?: ApiGame[];
  games?: ApiGame[];
  pagination?: PaginationInfo;
}

const cache = new Map<string, { data: CacheData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useSearch() {
  // Protection contre l'hydratation
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Référence pour le timeout de debouncing
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Synchronisation de clientCurrentPage avec la page de l'URL
  useEffect(() => {
    if (!isClient) return; // Ne pas synchroniser côté serveur
    
    if (query === 'top100_games' || query === 'top_year_games') {
      // Pour les listes spéciales, utiliser la pagination côté client
      setClientCurrentPage(1);
    } else {
      // Pour les recherches normales, synchroniser avec l'URL
      setClientCurrentPage(pageFromUrl);
    }
  }, [query, pageFromUrl, isClient]);

  // ==========================================================================
  // FONCTION DE CACHE - Gestion du cache des requêtes
  // ==========================================================================
  const getCachedData = (key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  const setCachedData = (key: string, data: CacheData) => {
    cache.set(key, { data, timestamp: Date.now() });
  };

  // ==========================================================================
  // EFFET DE RÉCUPÉRATION DES DONNÉES - Appels API avec debouncing et cache
  // ==========================================================================
  useEffect(() => {
    if (!isClient || !query) return; // Pas de requête ou pas côté client = pas d'appel API

    // Nettoyer le timeout précédent
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debouncing : attend 200ms avant de faire l'appel API
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      // Construction de l'URL selon le type de requête
      let apiUrl = '';
      let cacheKey = '';

      if (query === 'top100_games') {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/custom/games/top100?limit=100`;
        cacheKey = 'top100_games';
      } else if (query === 'top_year_games') {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/custom/games/year/top100?limit=100`;
        cacheKey = 'top_year_games';
      } else {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games/search/${encodeURIComponent(query)}?page=${pageFromUrl}&limit=20`;
        cacheKey = `search_${query}_${pageFromUrl}`;
      }

      // Vérifier le cache d'abord
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        if (query === 'top100_games' || query === 'top_year_games') {
          const gamesData = cachedData.member ?? cachedData;
          setGames(Array.isArray(gamesData) ? gamesData : []);
          setPagination({ currentPage: 1, limit: 20, offset: 0, totalCount: Array.isArray(gamesData) ? gamesData.length : 0 });
        } else {
          setGames(cachedData.games ?? []);
          setPagination(cachedData.pagination ?? { currentPage: 1, limit: 20, offset: 0 });
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Mettre en cache les données
        setCachedData(cacheKey, data);

        if (query === 'top100_games' || query === 'top_year_games') {
          const gamesData = data.member ?? data;
          setGames(Array.isArray(gamesData) ? gamesData : []);
          setPagination({ currentPage: 1, limit: 20, offset: 0, totalCount: gamesData.length });
        } else {
          setGames(data.games ?? []);
          setPagination(data.pagination);
        }
      } catch (e) {
        console.error("Erreur lors de la récupération des données:", e);
        setError('Erreur de chargement des données.');
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_TIME);

    // Nettoyage du timeout si la requête change
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, pageFromUrl, isClient]);
  
  // ==========================================================================
  // PIPELINE DE TRAITEMENT DES DONNÉES - Filtrage, tri et pagination
  // ==========================================================================
  
  // Filtrage des jeux selon les critères sélectionnés
  const filteredGames = useMemo(() => filterGames(games, filters), [games, filters]);
  
  // Tri des jeux filtrés selon l'option et la direction
  const sortedGames = useMemo(() => sortGames(filteredGames, sort), [filteredGames, sort]);
  
  // Calcul du nombre total de pages
  // Pour les recherches normales, utiliser la pagination côté serveur
  // Pour les top100/top_year, utiliser la pagination côté client
  const totalPages = useMemo(() => {
    if (query === 'top100_games' || query === 'top_year_games') {
      return Math.ceil(sortedGames.length / pagination.limit);
    } else {
      // Utiliser la pagination côté serveur pour les recherches normales
      // Priorité à totalPages si disponible (nouvelle API), sinon calculer avec totalCount
      if (pagination.totalPages !== undefined) {
        return pagination.totalPages;
      }
      return pagination.totalCount ? Math.ceil(pagination.totalCount / pagination.limit) : 1;
    }
  }, [sortedGames, pagination, query]);

  // Pagination : découpage des jeux pour afficher seulement la page courante
  const paginatedGames = useMemo(() => {
    if (query === 'top100_games' || query === 'top_year_games') {
      // Pagination côté client pour les listes spéciales
      const offset = (clientCurrentPage - 1) * pagination.limit;
      return sortedGames.slice(offset, offset + pagination.limit);
    } else {
      // Pour les recherches normales, les jeux sont déjà paginés côté serveur
      // Pas besoin de re-paginer, on utilise directement les jeux reçus
      return sortedGames;
    }
  }, [sortedGames, clientCurrentPage, pagination.limit, query]);

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
    if (query === 'top100_games' || query === 'top_year_games') {
      // Pagination côté client pour les listes spéciales
      setClientCurrentPage(newPage);
    } else {
      // Pour les recherches normales, mettre à jour l'URL pour déclencher une nouvelle requête API
      const url = new URL(window.location.href);
      url.searchParams.set('page', newPage.toString());
      window.history.pushState({}, '', url.toString());
      // La nouvelle requête sera déclenchée automatiquement par l'effet qui écoute les changements d'URL
    }
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