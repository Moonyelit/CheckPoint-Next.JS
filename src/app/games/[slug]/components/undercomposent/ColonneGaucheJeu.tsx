import React from "react";
import "../styles/ColonneGaucheJeu.scss";
import { Game } from "@/types/game";

export default function ColonneGaucheJeu({ game }: { game: Game }) {
  return (
    <aside className="colonne-gauche-jeu">
      <img className="colonne-gauche-jeu__cover" src={game.coverUrl || "/images/placeholder-cover.jpg"} alt={game.title} />
      <button className="button button--primary" style={{ width: "100%", marginTop: 16 }}>Ajouter à ma collection</button>
      <div style={{ margin: "16px 0" }}>⭐⭐⭐⭐⭐</div>
      <button className="button button--inverse" style={{ width: "100%" }}>Ajouter à une liste</button>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", width: "100%", marginTop: 16 }}>
        <span style={{ background: "#dbeafe", borderRadius: 8, padding: "4px 12px", fontWeight: 600 }}>J&apos;ai</span>
        <span style={{ background: "#dbeafe", borderRadius: 8, padding: "4px 12px", fontWeight: 600 }}>J&apos;y joue</span>
        <span style={{ background: "#dbeafe", borderRadius: 8, padding: "4px 12px", fontWeight: 600 }}>Je veux</span>
      </div>
    </aside>
  );
} 