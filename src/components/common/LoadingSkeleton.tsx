import React from 'react';
import './LoadingSkeleton.scss';

interface LoadingSkeletonProps {
  type?: 'game-card' | 'search-results' | 'hero-banner' | 'filter-card';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'game-card', 
  count = 1 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'game-card':
        return (
          <div className="skeleton-game-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-platforms">
                <div className="skeleton-platform"></div>
                <div className="skeleton-platform"></div>
              </div>
              <div className="skeleton-rating"></div>
            </div>
          </div>
        );
      
      case 'search-results':
        return (
          <div className="skeleton-search-results">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton-game-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-platforms">
                    <div className="skeleton-platform"></div>
                    <div className="skeleton-platform"></div>
                  </div>
                  <div className="skeleton-rating"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'hero-banner':
        return (
          <div className="skeleton-hero-banner">
            <div className="skeleton-hero-content">
              <div className="skeleton-hero-title"></div>
              <div className="skeleton-hero-subtitle"></div>
              <div className="skeleton-hero-button"></div>
            </div>
          </div>
        );
      
      case 'filter-card':
        return (
          <div className="skeleton-filter-card">
            <div className="skeleton-filter-title"></div>
            <div className="skeleton-filter-options">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton-filter-option"></div>
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