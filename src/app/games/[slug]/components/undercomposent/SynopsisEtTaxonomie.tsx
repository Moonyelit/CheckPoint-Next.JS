import React from "react";
import { Game } from "@/types/game";

export default function SynopsisEtTaxonomie({ game }: { game?: Game }) {
  if (!game) return null;
  return (
    <section className="synopsis-taxonomie">
      <h2 className="synopsis-title">SYNOPSIS</h2>
      <p className="synopsis-text">{game.synopsis || game.summary || "Aucun synopsis disponible."}</p>
      <div className="taxonomie-item">
        <strong>Plateformes :</strong> {game.platforms?.join(", ") || "-"}
      </div>
      <div className="taxonomie-item">
        <strong>Genres :</strong> {game.genres?.join(", ") || "-"}
      </div>
    </section>
  );
} 