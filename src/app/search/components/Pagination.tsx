import React from "react";
import 'boxicons/css/boxicons.min.css';

interface PaginationInfo {
  currentPage: number;
  limit: number;
  offset: number;
  totalCount?: number;
}

interface PaginationProps {
  pagination: PaginationInfo;
  totalPages: number;
  onPageChange: (page: number) => void;
  query: string;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, totalPages, onPageChange, query }) => {
  // Ne pas afficher la pagination pour les jeux de l'année
  if (query === "top_year_games") {
    return null;
  }

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
          onClick={() => onPageChange(1)}
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
            onClick={() => onPageChange(i)}
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
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="search-page__pagination">
      <button
        className="search-page__pagination-button"
        onClick={() => onPageChange(1)}
        disabled={pagination.currentPage === 1}
        aria-label="Première page"
      >
        <i className='bx bx-chevrons-left'></i>
      </button>
      <button
        className="search-page__pagination-button"
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
        aria-label="Page précédente"
      >
        <i className='bx bx-chevron-left'></i>
      </button>
      {renderPageNumbers()}
      <button
        className="search-page__pagination-button"
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === totalPages}
        aria-label="Page suivante"
      >
        <i className='bx bx-chevron-right'></i>
      </button>
      <button
        className="search-page__pagination-button"
        onClick={() => onPageChange(totalPages)}
        disabled={pagination.currentPage === totalPages}
        aria-label="Dernière page"
      >
        <i className='bx bx-chevrons-right'></i>
      </button>
    </div>
  );
};

export default Pagination; 