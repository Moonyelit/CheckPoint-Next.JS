import Link from 'next/link';
import './offline.scss';

export default function OfflinePage() {
  return (
    <div className="offline-page">
      <div className="offline-container">
        <div className="offline-icon">📡</div>
        <h1 className="offline-title">Pas de connexion</h1>
        <p className="offline-description">
          Il semble que vous soyez hors ligne. Vérifiez votre connexion internet et réessayez.
        </p>
        
        <div className="offline-actions">
          <button 
            onClick={() => window.location.reload()}
            className="offline-btn offline-btn--primary"
          >
            Réessayer
          </button>
          
          <Link href="/" className="offline-btn offline-btn--secondary">
            Retour à l'accueil
          </Link>
        </div>
        
        <div className="offline-info">
          <p>
            <strong>Conseil :</strong> Certaines pages peuvent être disponibles hors ligne 
            grâce au cache de l'application.
          </p>
        </div>
      </div>
    </div>
  );
} 