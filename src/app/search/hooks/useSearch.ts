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
  totalItems?: number;
  totalPages?: number;
}

// Cache avec limite de taille pour éviter les fuites mémoire
class SearchCache {
  private cache = new Map<string, { data: CacheData; timestamp: number }>();
  private readonly maxSize = 50; // Limite à 50 entrées
  private readonly cacheDuration = 5 * 60 * 1000; // 5 minutes

  get(key: string): CacheData | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key); // Nettoyer les entrées expirées
    }
    return null;
  }

  set(key: string, data: CacheData): void {
    // Nettoyer si on atteint la limite
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    return this.cache.size;
  }
}

const searchCache = new SearchCache();

export function useSearch() {
  // Protection contre l'hydratation
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Vider le cache au démarrage pour forcer le rechargement des données
    searchCache.clear();
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
    return searchCache.get(key);
  };

  const setCachedData = (key: string, data: CacheData) => {
    searchCache.set(key, data);
  };

  // ==========================================================================
  // EFFET DE RÉCUPÉRATION DES DONNÉES - Appels API avec debouncing et cache
  // ==========================================================================
  useEffect(() => {
    console.log('[DEBUG] useSearch - useEffect déclenché avec:', {
      isClient,
      query,
      pageFromUrl
    });
    
    if (!isClient || !query) {
      console.log('[DEBUG] useSearch - effet annulé car:', {
        isClient: !isClient,
        noQuery: !query
      });
      return; // Pas de requête ou pas côté client = pas d'appel API
    }

    console.log('[DEBUG] useSearch - début de l\'appel API pour query:', query);

    // Nettoyer le timeout précédent
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debouncing : attend 200ms avant de faire l'appel API
    debounceRef.current = setTimeout(async () => {
      console.log('[DEBUG] useSearch - debouncing terminé, appel API pour:', query);
      
      // Construction de l'URL selon le type de requête
      let apiUrl = '';
      let cacheKey = '';

      if (query === 'top100_games') {
        // Utiliser l'endpoint Top100Games avec critères stricts
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/top100_games`;
        cacheKey = 'top100_games';
      } else if (query === 'top_year_games') {
        // Utiliser l'endpoint API Platform avec filtre sur la date
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const dateFilter = oneYearAgo.toISOString().split('T')[0];
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games?order[totalRating]=desc&order[totalRatingCount]=desc&releaseDate[gte]=${dateFilter}&itemsPerPage=100`;
        cacheKey = 'top_year_games';
      } else {
        // NOUVELLE LOGIQUE : Utiliser la recherche intelligente (local + IGDB + filtrage intelligent)
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games/search-intelligent/${encodeURIComponent(query.trim())}`;
        // Les filtres ne sont pas envoyés à l'API, ils sont appliqués côté client
        cacheKey = `search_intelligent_${query}`;
      }

      console.log('[DEBUG] useSearch - URL API construite:', apiUrl);
      console.log('[DEBUG] useSearch - cache key:', cacheKey);

      // Vérifier le cache d'abord
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        if (query === 'top100_games') {
          // Données Top100Games : utiliser games pour la collection
          const gamesData = cachedData.games ?? [];
          setGames(Array.isArray(gamesData) ? gamesData : []);
          setPagination({ 
            currentPage: 1, 
            limit: 20, 
            offset: 0, 
            totalCount: gamesData.length,
            totalPages: Math.ceil(gamesData.length / 20)
          });
        } else if (query === 'top_year_games') {
          // Données API Platform : utiliser member pour la collection
          const gamesData = cachedData.member ?? cachedData.games ?? [];
          setGames(Array.isArray(gamesData) ? gamesData : []);
          setPagination({ 
            currentPage: 1, 
            limit: 20, 
            offset: 0, 
            totalCount: cachedData.totalItems ?? gamesData.length,
            totalPages: cachedData.totalPages ?? Math.ceil((cachedData.totalItems ?? gamesData.length) / 20)
          });
        } else {
          // Données de recherche intelligente : format direct
          setGames(cachedData.games ?? []);
          const totalItems = cachedData.games?.length ?? 0;
          const currentPage = pageFromUrl;
          setPagination({ 
            currentPage, 
            limit: 20, 
            offset: (currentPage - 1) * 20,
            totalCount: totalItems,
            totalPages: Math.ceil(totalItems / 20)
          });
        }
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('[DEBUG] useSearch - début fetch vers:', apiUrl);
        const response = await fetch(apiUrl);
        
        console.log('[DEBUG] useSearch - réponse reçue, status:', response.status);
        
        if (!response.ok) {
          console.error('[DEBUG] useSearch - erreur HTTP:', response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('[DEBUG] useSearch - parsing JSON...');
        const data = await response.json();
        
        console.log('[DEBUG] useSearch - données API reçues:', data);
        console.log('[DEBUG] useSearch - type de data:', typeof data);
        console.log('[DEBUG] useSearch - data est un array?', Array.isArray(data));
        
        // Mettre en cache les données
        setCachedData(cacheKey, data);

        if (query === 'top100_games') {
          // Données Top100Games : utiliser games pour la collection
          const gamesData = data.games ?? [];
          setGames(Array.isArray(gamesData) ? gamesData : []);
          
          // Debug log pour voir combien de jeux sont récupérés
          console.log(`[DEBUG] Jeux récupérés pour ${query}:`, {
            totalFromAPI: gamesData.length,
            isArray: Array.isArray(gamesData),
            dataKeys: Object.keys(data)
          });
          
          setPagination({ 
            currentPage: 1, 
            limit: 20, 
            offset: 0, 
            totalCount: gamesData.length,
            totalPages: Math.ceil(gamesData.length / 20)
          });
        } else if (query === 'top_year_games') {
          // Données API Platform : utiliser member pour la collection
          const gamesData = data.member ?? data.games ?? [];
          setGames(Array.isArray(gamesData) ? gamesData : []);
          
          // Debug log pour voir combien de jeux sont récupérés
          console.log(`[DEBUG] Jeux récupérés pour ${query}:`, {
            totalFromAPI: gamesData.length,
            isArray: Array.isArray(gamesData),
            dataKeys: Object.keys(data)
          });
          
          setPagination({ 
            currentPage: 1, 
            limit: 20, 
            offset: 0, 
            totalCount: data.totalItems ?? gamesData.length,
            totalPages: data.totalPages ?? Math.ceil((data.totalItems ?? gamesData.length) / 20)
          });
        } else {
          // NOUVELLE LOGIQUE : Données de recherche intelligente
          const gamesData = Array.isArray(data) ? data : [];
          console.log('[DEBUG] useSearch - gamesData avant setGames:', gamesData);
          setGames(gamesData);
          const totalItems = gamesData.length;
          const currentPage = pageFromUrl;
          
          console.log(`[DEBUG] Recherche intelligente pour '${query}':`, {
            totalFromAPI: gamesData.length,
            isArray: Array.isArray(gamesData),
            dataKeys: Object.keys(data)
          });
          
          setPagination({ 
            currentPage, 
            limit: 20, 
            offset: (currentPage - 1) * 20,
            totalCount: totalItems,
            totalPages: Math.ceil(totalItems / 20)
          });
          
          // Si aucun résultat avec la recherche intelligente, essayer API Platform comme fallback
          if (gamesData.length === 0 && query.trim()) {
            console.log(`[DEBUG] Aucun résultat avec recherche intelligente, tentative API Platform`);
            
            try {
              const searchParams = new URLSearchParams();
              searchParams.append('title', query.trim());
              searchParams.append('page', pageFromUrl.toString());
              searchParams.append('itemsPerPage', '20');
              
              const platformResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games?${searchParams.toString()}`);
              if (platformResponse.ok) {
                const platformData = await platformResponse.json();
                const platformGames = platformData.member ?? platformData.games ?? [];
                
                if (platformGames.length > 0) {
                  console.log(`[DEBUG] API Platform trouvé ${platformGames.length} jeux vs 0 recherche intelligente`);
                  setGames(platformGames);
                  const totalItems = platformData.totalItems ?? 0;
                  setPagination({ 
                    currentPage, 
                    limit: 20, 
                    offset: (currentPage - 1) * 20,
                    totalCount: totalItems,
                    totalPages: platformData.totalPages ?? Math.ceil(totalItems / 20)
                  });
                }
              }
            } catch (error) {
              console.log('[DEBUG] Erreur lors du fallback API Platform:', error);
            }
          }
        }
      } catch (error) {
        console.error('[DEBUG] useSearch - erreur lors de l\'appel API:', error);
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
  
  // Pagination : découpage des jeux pour afficher seulement la page courante
  const paginatedGames = useMemo(() => {
    console.log('[DEBUG] useSearch - games reçus:', games);
    console.log('[DEBUG] useSearch - query:', query);
    console.log('[DEBUG] useSearch - clientCurrentPage:', clientCurrentPage);
    console.log('[DEBUG] useSearch - pagination:', pagination);
    
    // Pagination côté client pour les listes spéciales ET la recherche rapide
    if (
      query === 'top100_games' ||
      query === 'top_year_games' ||
      // Pour la recherche rapide, on utilise toujours la pagination côté client
      (query && query !== 'top100_games' && query !== 'top_year_games')
    ) {
      const offset = (clientCurrentPage - 1) * pagination.limit;
      const result = sortedGames.slice(offset, offset + pagination.limit);
      console.log('[DEBUG] useSearch - paginatedGames (client):', result);
      return result;
    } else {
      // Pour les recherches normales, les jeux sont déjà paginés côté serveur
      console.log('[DEBUG] useSearch - paginatedGames (server):', sortedGames);
      return sortedGames;
    }
  }, [sortedGames, clientCurrentPage, pagination.limit, query, games]);

  // Calcul du nombre total de pages
  const totalPages = useMemo(() => {
    if (
      query === 'top100_games' ||
      query === 'top_year_games' ||
      // Pour la recherche rapide, on calcule toujours côté client
      (query && query !== 'top100_games' && query !== 'top_year_games')
    ) {
      return Math.ceil(sortedGames.length / pagination.limit);
    } else {
      if (pagination.totalPages !== undefined) {
        return pagination.totalPages;
      }
      return pagination.totalCount ? Math.ceil(pagination.totalCount / pagination.limit) : 1;
    }
  }, [sortedGames, pagination, query, games]);

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
    if (
      query === 'top100_games' || 
      query === 'top_year_games' ||
      // Pour la recherche rapide, utiliser la pagination côté client
      (query && query !== 'top100_games' && query !== 'top_year_games')
    ) {
      // Pagination côté client pour les listes spéciales et la recherche rapide
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