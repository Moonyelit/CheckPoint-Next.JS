/**
 * ==========================================================================
 * GAME LOGIC - Logique métier pour le filtrage et le tri des jeux
 * ==========================================================================
 * 
 * Ce fichier contient les fonctions pures pour :
 * - filterGames : Filtrer les jeux selon les critères sélectionnés (genres, plateformes, etc.)
 * - sortGames : Trier les jeux par note, date de sortie ou nom (ascendant/descendant)
 * 
 * Ces fonctions sont utilisées par le hook useSearch pour traiter les données
 * côté client et offrir une expérience utilisateur réactive.
 * ==========================================================================
 */

import { ApiGame, Filters, SortState } from "../types";

/**
 * Filtre une liste de jeux selon les critères sélectionnés
 * @param games - Liste complète des jeux à filtrer
 * @param activeFilters - Filtres actifs (genres, plateformes, modes de jeu, perspectives)
 * @returns Liste des jeux qui correspondent à tous les filtres actifs
 */
export function filterGames(games: ApiGame[], activeFilters: Filters): ApiGame[] {
  return games.filter(game => {
    /**
     * Fonction helper pour vérifier si un jeu correspond à un type de filtre
     * @param gameProperty - Propriété du jeu (genres, plateformes, etc.)
     * @param filterValues - Valeurs du filtre sélectionnées par l'utilisateur
     * @returns true si le jeu correspond au filtre, false sinon
     */
    const checkFilter = (gameProperty: (string | {name: string})[] | undefined, filterValues: string[]): boolean => {
      if (filterValues.length === 0) return true; // Aucun filtre = tous les jeux passent
      if (!gameProperty) return false; // Pas de propriété = jeu exclu
      // Vérifie si au moins une valeur du filtre correspond à une propriété du jeu
      return filterValues.some(val => gameProperty.some(p => (typeof p === 'string' ? p : p.name) === val));
    };
    
    // Vérification de tous les filtres - le jeu doit passer TOUS les tests
    if (!checkFilter(game.genres, activeFilters.genres)) return false;
    if (!checkFilter(game.platforms, activeFilters.platforms)) return false;
    if (!checkFilter(game.gameModes, activeFilters.gameModes)) return false;
    if (!checkFilter(game.perspectives, activeFilters.perspectives)) return false;
    
    return true; // Le jeu passe tous les filtres
  });
}

/**
 * Trie une liste de jeux selon l'option et la direction spécifiées
 * @param games - Liste des jeux à trier
 * @param sortState - État du tri (option et direction)
 * @returns Liste des jeux triés
 */
export function sortGames(games: ApiGame[], sortState: SortState): ApiGame[] {
  const gamesToSort = [...games]; // Copie pour éviter de modifier l'original
  
  gamesToSort.sort((a, b) => {
    let valA, valB; // Variables pour stocker les valeurs à comparer

    // Sélection des valeurs à comparer selon l'option de tri
    switch (sortState.option) {
      case "note":
        // Tri par note moyenne (gère les deux formats possibles de l'API)
        valA = a.total_rating ?? a.totalRating ?? 0;
        valB = b.total_rating ?? b.totalRating ?? 0;
        break;
        
      case "releaseDate":
        // Tri par date de sortie (gère timestamp Unix et format string)
        valA = a.first_release_date
          ? a.first_release_date * 1000  // Conversion timestamp en millisecondes
          : a.releaseDate
          ? new Date(a.releaseDate).getTime()  // Conversion string en timestamp
          : 0;
        valB = b.first_release_date
          ? b.first_release_date * 1000
          : b.releaseDate
          ? new Date(b.releaseDate).getTime()
          : 0;
        break;
        
      case "name":
        // Tri alphabétique par nom (gère les deux formats possibles)
        valA = a.name ?? a.title ?? "";
        valB = b.name ?? b.title ?? "";
        // Tri spécial pour les chaînes de caractères avec localeCompare
        if (sortState.direction === "asc") {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
    }

    // Tri numérique pour les notes et dates
    if (sortState.direction === "asc") {
      return (valA ?? 0) > (valB ?? 0) ? 1 : -1; // Tri ascendant
    } else {
      return (valB ?? 0) > (valA ?? 0) ? 1 : -1; // Tri descendant
    }
  });

  return gamesToSort;
} 