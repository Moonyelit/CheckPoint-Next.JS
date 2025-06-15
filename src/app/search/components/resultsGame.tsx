import React from "react";
import "../styles/resultsGame.scss";

interface ResultsGameProps {
  title: string;
  coverUrl?: string;
  platforms?: string[];
  score?: number;
}

const ResultsGame: React.FC<ResultsGameProps> = ({ title, coverUrl, platforms, score }) => {
  return (
    <article className="results-game">
      {coverUrl && <img src={coverUrl} alt={title} className="results-game__cover" />}
      <div className="results-game__info">
        <div className="results-game__title">{title}</div>
        {platforms && platforms.length > 0 && (
          <div className="results-game__platforms">
            {platforms.map((p, i) => (
              <span key={i} className="results-game__platform">{p}</span>
            ))}
          </div>
        )}
      </div>
      {typeof score === 'number' && (
        <div className="results-game__score">
          <div className="results-game__score-circle">
            <span>{Math.round(score)}%</span>
          </div>
        </div>
      )}
    </article>
  );
};

export default ResultsGame;
