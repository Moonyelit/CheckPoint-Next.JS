import React from 'react';
import './styles/LoadingSkeleton.scss';

interface LoadingSkeletonProps {
  type?: 'game-card' | 'search-results' | 'hero-banner' | 'filter-card' | 'search-result-item';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'game-card', 
  count = 1 
}) => {
  const renderSkeleton = (): React.ReactNode => {
    switch (type) {
      case 'game-card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-card__image"></div>
            <div className="skeleton-card__content">
              <div className="skeleton-card__title"></div>
              <div className="skeleton-card__platforms">
                <div className="skeleton-card__platform"></div>
                <div className="skeleton-card__platform"></div>
              </div>
              <div className="skeleton-card__rating"></div>
            </div>
          </div>
        );
      
      case 'search-result-item':
        return (
          <div className="skeleton-search-item">
            <div className="skeleton-search-item__image"></div>
            <div className="skeleton-search-item__details">
              <div className="skeleton-search-item__title"></div>
              <div className="skeleton-search-item__platforms">
                <div className="skeleton-search-item__platform"></div>
                <div className="skeleton-search-item__platform"></div>
                <div className="skeleton-search-item__platform"></div>
                <div className="skeleton-search-item__platform-plus"></div>
              </div>
            </div>
            <div className="skeleton-search-item__progress-circle"></div>
          </div>
        );

      case 'search-results':
        return (
          <div className="skeleton-search-results">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton-card__image"></div>
                <div className="skeleton-card__content">
                  <div className="skeleton-card__title"></div>
                  <div className="skeleton-card__platforms">
                    <div className="skeleton-card__platform"></div>
                    <div className="skeleton-card__platform"></div>
                  </div>
                  <div className="skeleton-card__rating"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'hero-banner':
        return (
          <div className="skeleton-hero">
            <div className="skeleton-hero__content">
              <div className="skeleton-hero__title"></div>
              <div className="skeleton-hero__subtitle"></div>
              <div className="skeleton-hero__button"></div>
            </div>
          </div>
        );
      
      case 'filter-card':
        return (
          <div className="skeleton-filter">
            <div className="skeleton-filter__title"></div>
            <div className="skeleton-filter__options">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton-filter__option"></div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div className="skeleton-default"></div>;
    }
  };

  return (
    <div className="loading-skeleton">
      {renderSkeleton()}
    </div>
  );
};

export default LoadingSkeleton; 