import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./styles/SearchOverlay.scss";

interface SearchOverlayProps {
  onClose: () => void;
}

const ANIMATION_DURATION = 350; // ms

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [closing, setClosing] = useState(false);
  const [closeClicked, setCloseClicked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
      handleClose();
    }
  };

  const handleClose = () => {
    setCloseClicked(true);
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, ANIMATION_DURATION);
  };

  return (
    <div 
      className={`search-overlay${closing ? " fadeOut" : " fadeIn"}`} 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Recherche de jeux"
    >
      <div 
        className="search-overlay__center search-overlay__center--fullscreen" 
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <div 
          className="search-overlay__form" 
          style={{cursor: 'text', display: 'flex', alignItems: 'center', width: '100vw'}}
        >
          <form onSubmit={handleSubmit} style={{width: 'auto', flexShrink: 0}} role="search">
            <label htmlFor="search-input" className="sr-only">
              Rechercher un jeu
            </label>
            <input
              id="search-input"
              ref={inputRef}
              className="search-overlay__input search-overlay__input--giant"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher votre jeu"
              autoComplete="off"
              aria-label="Rechercher votre jeu"
              aria-describedby="search-description"
              spellCheck={false}
              role="searchbox"
            />
            <div id="search-description" className="sr-only">
              Tapez le nom du jeu que vous recherchez et appuyez sur Entrée pour lancer la recherche
            </div>
          </form>
          <div
            className="search-overlay__focuszone"
            style={{flex: 1, height: '100%', cursor: 'text'}}
            onClick={() => inputRef.current?.focus()}
            role="button"
            tabIndex={-1}
            aria-label="Cliquer pour activer la recherche"
          />
        </div>
        <button 
          className={`search-overlay__close${closeClicked ? ' search-overlay__close--clicked' : ''}`} 
          onClick={handleClose} 
          aria-label="Fermer la recherche"
          type="button"
        >
          <span className="search-overlay__bar search-overlay__bar1" aria-hidden="true" />
          <span className="search-overlay__bar search-overlay__bar2" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default SearchOverlay;