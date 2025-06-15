"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./search.scss";
import ResultsGame from "./components/resultsGame";

interface Game {
  id: number;
  title: string;
  coverUrl?: string;
  releaseDate?: string;
  platforms?: string[];
  totalRating?: number;
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
      .then(data => {
        console.log('Données reçues:', data);
        if (Array.isArray(data.member)) {
          setGames(data.member);
        } else {
          setGames([]);
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="search-page main-container">
      <h1 className="search-page__title">Jeux</h1>
      {loading && <div>Chargement...</div>}
      {error && <div className="search-page__error">{error}</div>}
      <section className="search-page__results">
        {games.length === 0 && !loading && !error && <div>Aucun jeu trouvé.</div>}
        {games.map(game => (
          <ResultsGame
            key={game.id}
            title={game.title}
            coverUrl={game.coverUrl}
            platforms={game.platforms}
            score={game.totalRating}
          />
        ))}
      </section>
    </div>
  );
}