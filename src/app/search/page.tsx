"use client";
import SearchBar from "./components/searchbar";
import FilterContainer from "./components/FilterContainer";
import SearchResults from "./components/SearchResults";
import Pagination from "./components/Pagination";
import SortingDropdown from "./components/SortingDropdown";
import { useSearch } from "./hooks/useSearch";
import { useState } from "react";
import "./search.scss";
import React from "react";

export default function SearchPage() {
  const {
    query,
    loading,
    error,
    paginatedGames,
    totalPages,
    sortKey,
    clientCurrentPage,
    pagination,
    handleFiltersChange,
    handleSort,
    handlePageChange,
    handleSearch,
  } = useSearch();

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  return (
    <div className="search-page main-container">
      <h1 className="search-page__title">Jeux</h1>

      <div className="search-page__content">
        <aside
          className={`search-page__filters ${isFilterVisible ? "is-visible" : ""}`}
          aria-label="Filtres de recherche"
          role="complementary"
        >
          <div className="search-page__filters-header">
            <h2 className="search-page__filters-title">Filtres</h2>
            <button
              className="search-page__filters-close"
              onClick={() => setIsFilterVisible(false)}
              aria-label="Fermer les filtres"
              type="button"
            >
              <i className="bx bx-x" aria-hidden="true"></i>
            </button>
          </div>
          <FilterContainer onFiltersChange={handleFiltersChange} />
        </aside>
        
        <main className="search-page__main" role="main">
          <div className="search-page__search-controls">
            <SearchBar
              initialQuery={
                query === "top100_games" || query === "top_year_games"
                  ? ""
                  : query
              }
              onSearch={handleSearch}
            />
            <SortingDropdown onSort={handleSort} />
          </div>

          <SearchResults
            key={sortKey}
            games={paginatedGames}
            loading={loading}
            error={error}
          />

          {totalPages > 1 && (
            <Pagination
              pagination={{ ...pagination, currentPage: clientCurrentPage }}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              query={query}
            />
          )}
        </main>
      </div>

      {isFilterVisible && (
        <div
          className="search-page__overlay"
          onClick={() => setIsFilterVisible(false)}
          aria-hidden="true"
        ></div>
      )}

      <button
        className="search-page__filter-fab"
        onClick={() => setIsFilterVisible(true)}
        aria-label="Ouvrir les filtres de recherche"
        aria-expanded={isFilterVisible}
        type="button"
      >
        <i className="bx bx-filter-alt" aria-hidden="true"></i> Filtres
      </button>
    </div>
  );
}
