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
    <div className={`search-overlay${closing ? " fadeOut" : " fadeIn"}`} onClick={handleClose}>
      <div className="search-overlay__center search-overlay__center--fullscreen" onClick={e => e.stopPropagation()}>
        <div className="search-overlay__form" style={{cursor: 'text', display: 'flex', alignItems: 'center', width: '100vw'}}>
          <form onSubmit={handleSubmit} style={{width: 'auto', flexShrink: 0}}>
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
              spellCheck={false}
            />
          </form>
          <div
            className="search-overlay__focuszone"
            style={{flex: 1, height: '100%', cursor: 'text'}}
            onClick={() => inputRef.current?.focus()}
          />
        </div>
        <button className={`search-overlay__close${closeClicked ? ' search-overlay__close--clicked' : ''}`} onClick={handleClose} aria-label="Fermer la recherche">
          <span className="search-overlay__bar search-overlay__bar1" />
          <span className="search-overlay__bar search-overlay__bar2" />
        </button>
      </div>
    </div>
  );
};

export default SearchOverlay;