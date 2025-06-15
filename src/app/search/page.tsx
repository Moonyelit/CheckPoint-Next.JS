"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./search.scss";

interface Game {
  id: number;
  title: string;
  coverUrl?: string;
  releaseDate?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games?title=${encodeURIComponent(query)}`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de la recherche");
        return res.json();
      })
      .then(data => setGames(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="search-page">
      <h1>Résultats de recherche pour : <span className="search-page__query">{query}</span></h1>
      {loading && <div>Chargement...</div>}
      {error && <div className="search-page__error">{error}</div>}
      <div className="search-page__results">
        {games.length === 0 && !loading && !error && <div>Aucun jeu trouvé.</div>}
        {games.map(game => (
          <div key={game.id} className="search-page__game">
            {game.coverUrl && <img src={game.coverUrl} alt={game.title} className="search-page__cover" />}
            <div className="search-page__info">
              <div className="search-page__title">{game.title}</div>
              {game.releaseDate && <div className="search-page__date">{game.releaseDate}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
