import RadarChart from './RadarChart';
import './styles/GameSidebar.scss';

interface GameSidebarProps {
  stats?: {
    ost: number;
    maniabilite: number;
    gameplay: number;
    graphismes: number;
    duree_de_vie: number;
  };
  totalRating?: number;
  userRating?: number;
}

export default function GameSidebar({ stats, totalRating, userRating }: GameSidebarProps) {
  return (
    <div className="game-sidebar">
      <div className="game-sidebar__section">
        <h2 className="game-sidebar__title">ÉVALUATIONS</h2>
        
        {totalRating && (
          <div className="game-sidebar__rating">
            <div className="game-sidebar__rating-score">
              <span className="game-sidebar__rating-number">{totalRating.toFixed(1)}</span>
              <span className="game-sidebar__rating-max">/10</span>
            </div>
            <div className="game-sidebar__rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`game-sidebar__star ${star <= Math.round(totalRating / 2) ? 'game-sidebar__star--filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="game-sidebar__rating-label">Note globale</p>
          </div>
        )}

        {userRating && (
          <div className="game-sidebar__user-rating">
            <div className="game-sidebar__rating-score">
              <span className="game-sidebar__rating-number">{userRating.toFixed(1)}</span>
              <span className="game-sidebar__rating-max">/10</span>
            </div>
            <div className="game-sidebar__rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`game-sidebar__star ${star <= Math.round(userRating / 2) ? 'game-sidebar__star--filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="game-sidebar__rating-label">Votre note</p>
          </div>
        )}
      </div>

      {stats && (
        <div className="game-sidebar__section">
          <h3 className="game-sidebar__subtitle">Détail des évaluations</h3>
          <div className="game-sidebar__chart">
            <RadarChart stats={stats} />
          </div>
        </div>
      )}

      <div className="game-sidebar__section">
        <h3 className="game-sidebar__subtitle">Actions rapides</h3>
        <div className="game-sidebar__quick-actions">
          <button className="game-sidebar__quick-btn game-sidebar__quick-btn--share">
            <span className="game-sidebar__quick-icon">📤</span>
            Partager
          </button>
          <button className="game-sidebar__quick-btn game-sidebar__quick-btn--favorite">
            <span className="game-sidebar__quick-icon">❤️</span>
            Favoris
          </button>
          <button className="game-sidebar__quick-btn game-sidebar__quick-btn--compare">
            <span className="game-sidebar__quick-icon">⚖️</span>
            Comparer
          </button>
        </div>
      </div>
    </div>
  );
} 