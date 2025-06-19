import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "../styles/filterCard.scss";

interface FilterCardProps {
  filterType: string;
  label: string;
  values: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxVisibleItems?: number;
}

const OPEN_DURATION = 500;
const CLOSE_DURATION = 300;
const EASE_OPEN = 'cubic-bezier(0.34,1.56,0.64,1)';
const EASE_CLOSE = 'cubic-bezier(0.4,0,0.2,1)';

const FilterCard: React.FC<FilterCardProps> = ({ 
  filterType, 
  label, 
  values, 
  selectedValues, 
  onChange, 
  maxVisibleItems = 6 
}) => {
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(true);
  const [maxHeight, setMaxHeight] = useState<string>('0px');
  const [visible, setVisible] = useState(true);
  const [transition, setTransition] = useState<string>(`max-height ${OPEN_DURATION}ms ${EASE_OPEN}, opacity 0.3s`);
  const listRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayedValues = showAll ? values : values.slice(0, maxVisibleItems);

  const handleToggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
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

  // ResizeObserver pour suivre la hauteur réelle si les valeurs changent
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

  // Attendre que les valeurs supplémentaires soient rendues après clic sur "Montrer plus"
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
        <span>{label}</span>
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
        {displayedValues.map((value, index) => (
          <label key={`${value}-${index}`} className="filter-card__item">
            <input
              type="checkbox"
              checked={selectedValues.includes(value)}
              onChange={() => handleToggleValue(value)}
              aria-checked={selectedValues.includes(value)}
              aria-label={value}
            />
            {value}
          </label>
        ))}
        {values.length > maxVisibleItems && (
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

export default FilterCard; 