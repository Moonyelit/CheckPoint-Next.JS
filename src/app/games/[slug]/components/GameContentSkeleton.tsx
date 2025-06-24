import './styles/GameContentSkeleton.scss';

export default function GameContentSkeleton() {
  return (
    <div className="game-content-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-cover"></div>
        <div className="skeleton-info">
          <div className="skeleton-title"></div>
          <div className="skeleton-studio"></div>
        </div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-actions"></div>
        <div className="skeleton-synopsis"></div>
        <div className="skeleton-platforms"></div>
      </div>
    </div>
  );
} 