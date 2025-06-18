import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "../styles/genreFilter.scss";

interface GenreFilterProps {
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
}

const OPEN_DURATION = 500;
const CLOSE_DURATION = 300;
const EASE_OPEN = 'cubic-bezier(0.34,1.56,0.64,1)';
const EASE_CLOSE = 'cubic-bezier(0.4,0,0.2,1)';

const GenreFilter: React.FC<GenreFilterProps> = ({ selectedGenres, onChange }) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(true);
  const [maxHeight, setMaxHeight] = useState<string>('0px');
  const [visible, setVisible] = useState(true);
  const [transition, setTransition] = useState<string>(`max-height ${OPEN_DURATION}ms ${EASE_OPEN}, opacity 0.3s`);
  const listRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/genres`)
      .then(res => res.json())
      .then(data => setGenres(data))
      .catch(() => setGenres([]));
  }, []);

  const displayedGenres = showAll ? genres : genres.slice(0, 6);

  const handleToggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter(g => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  useLayoutEffect(() => {
    if (open && listRef.current) {
      setVisible(true);
      setTransition(`max-height ${OPEN_DURATION}ms ${EASE_OPEN}, opacity 0.3s`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (listRef.current) {
            setMaxHeight(listRef.current.scrollHeight + 'px');
          }
        });
      });
    } else {
      setTransition(`max-height ${CLOSE_DURATION}ms ${EASE_CLOSE}, opacity 0.2s`);
      setMaxHeight('0px');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(false), CLOSE_DURATION);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open]);

  // ResizeObserver pour suivre la hauteur réelle si les genres changent
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (open) {
        setMaxHeight(el.scrollHeight + 'px');
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  // Attendre que les genres supplémentaires soient rendus après clic sur "Montrer plus"
  useEffect(() => {
    if (open && listRef.current) {
      const timeout = setTimeout(() => {
        setMaxHeight(listRef.current!.scrollHeight + 'px');
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [showAll]);

  // Corriger le recalcul de hauteur après repli (clic sur "Montrer moins")
  useEffect(() => {
    if (!showAll && open && listRef.current) {
      const timeout = setTimeout(() => {
        const baseHeight = listRef.current!.scrollHeight;
        setMaxHeight((baseHeight + 20) + 'px'); // compensation pour le bouton
      }, OPEN_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [showAll]);

  return (
    <div className={`filter-card${open ? ' open' : ''}`}>
      <div
        className="filter-card__header"
        tabIndex={0}
        role="button"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o); }}
      >
        <span>Genre</span>
        <i className={`bx bx-chevron-down filter-card__chevron${open ? ' open' : ''}`}></i>
      </div>
      <div
        className="filter-card__list"
        ref={listRef}
        style={{
          maxHeight,
          opacity: open ? 1 : 0,
          transition,
          pointerEvents: open ? 'auto' : 'none',
          visibility: visible ? 'visible' : 'hidden',
        }}
      >
        {displayedGenres.map(genre => (
          <label key={genre} className="filter-card__item">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => handleToggleGenre(genre)}
              aria-checked={selectedGenres.includes(genre)}
              aria-label={genre}
            />
            {genre}
          </label>
        ))}
        {genres.length > 6 && (
          <button
            className="filter-card__more"
            onClick={() => setShowAll(!showAll)}
            type="button"
          >
            {showAll ? "Montrer moins ▲" : "Montrer plus ▼"}
          </button>
        )}
      </div>
    </div>
  );
};

export default GenreFilter;
