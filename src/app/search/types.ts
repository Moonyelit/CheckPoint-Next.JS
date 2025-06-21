/**
 * ==========================================================================
 * SEARCH TYPES - Types TypeScript pour la fonctionnalité de recherche
 * ==========================================================================
 * 
 * Ce fichier définit toutes les interfaces TypeScript utilisées dans
 * la fonctionnalité de recherche :
 * 
 * - ApiGame : Structure des données de jeu depuis l'API
 * - PaginationInfo : Informations de pagination
 * - Filters : État des filtres actifs (genres, plateformes, etc.)
 * - SortState : État du tri (option et direction)
 * 
 * Ces types assurent la cohérence et la sécurité des données
 * dans toute l'application de recherche.
 * ==========================================================================
 */

import { SortOption } from "./components/SortingDropdown";

/**
 * Interface représentant un jeu vidéo tel que retourné par l'API
 * Gère les différentes variantes de noms de propriétés selon les endpoints
 */
export interface ApiGame {
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
  releaseDate?: string;
  first_release_date?: number;
}

/**
 * Interface pour les informations de pagination
 * Utilisée pour gérer l'affichage par pages des résultats
 */
export interface PaginationInfo {
  currentPage: number;
  limit: number;
  offset: number;
  totalCount?: number;
}

/**
 * Interface pour l'état des filtres actifs
 * Chaque propriété contient un tableau des valeurs sélectionnées
 */
export interface Filters {
  genres: string[];       // Genres sélectionnés (Action, RPG, etc.)
  platforms: string[];    // Plateformes sélectionnées (PC, PS5, etc.)
  gameModes: string[];    // Modes de jeu sélectionnés (Solo, Multijoueur, etc.)
  perspectives: string[]; // Perspectives sélectionnées (1ère personne, etc.)
}

/**
 * Interface pour l'état du tri
 * Définit l'option de tri et sa direction
 */
export interface SortState {
    option: SortOption;
    direction: 'asc' | 'desc';
} 