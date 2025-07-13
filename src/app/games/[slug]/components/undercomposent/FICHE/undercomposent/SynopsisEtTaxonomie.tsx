import React, { useState, useEffect } from "react";
import { Game } from "@/types/game";
import "./styles/SynopsisEtTaxonomie.scss";

// Ajout de la fonction utilitaire en haut du fichier (après les imports)
function btoaUtf8(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

// Fonction pour formater les noms des plateformes
const formatPlatformName = (platform: string): string => {
  const platformMap: { [key: string]: string } = {
    "Xbox Series X|S": "Series X|S",
    "Xbox Series X S": "Series X|S",
    "PlayStation 5": "PS5",
    "PlayStation 4": "PS4",
    "PlayStation 3": "PS3",
    "PlayStation 2": "PS2",
    "PlayStation": "PS",
    "Nintendo Switch": "Switch",
    "Nintendo Switch 2": "Switch 2",
    "Nintendo 3DS": "3DS",
    "Nintendo DS": "DS",
    "PC (Microsoft Windows)": "PC",
    "PC": "PC",
    "macOS": "Mac",
    "Linux": "Linux",
    "Android": "Android",
    "iOS": "iOS"
  };

  // Chercher une correspondance exacte d'abord
  if (platformMap[platform]) {
    return platformMap[platform];
  }

  // Chercher une correspondance partielle
  for (const [key, value] of Object.entries(platformMap)) {
    if (platform.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Si aucune correspondance, retourner le nom original
  return platform;
};

// Fonction pour traduire le texte avec MyMemory (gratuit) + cache local
const translateText = async (text: string): Promise<string> => {
  try {
    const maxLength = 500;
    // Nettoyer le texte (supprimer les doublons)
    const cleanText = text.replace(/(.+?)(?=\1)/g, '').trim().slice(0, maxLength);
    if (!cleanText) return text;

    // Vérifier le cache local
    const cacheKey = `translation_${btoaUtf8(cleanText)}`;
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
    if (cached) return cached;

    // Utiliser MyMemory (service gratuit et fiable)
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=en|fr`);

    if (response.status === 429) {
      throw new Error('429');
    }
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      let translatedText = data.responseData.translatedText;
      // Améliorations post-traduction
      translatedText = translatedText
        .replace(/\b2025\b/g, "2025")
        .replace(/\b(\d{4})\b/g, "$1")
        .replace(/\bRPG\b/gi, "RPG")
        .replace(/\bNPCs\b/gi, "PNJ")
        .replace(/\bNPC\b/gi, "PNJ")
        .replace(/\baction\b/gi, "action")
        .replace(/\bgame\b/gi, "jeu")
        .replace(/\bcooperative\b/gi, "coopératif")
        .replace(/\bmultiplayer\b/gi, "multijoueur");
      // Stocker dans le cache local
      if (typeof window !== 'undefined') {
        localStorage.setItem(cacheKey, translatedText);
      }
      return translatedText;
    }
    return cleanText;
  } catch (error: any) {
    if (error.message === '429') {
      return "Trop de requêtes de traduction. Veuillez réessayer plus tard.";
    }
    console.error('Erreur de traduction:', error);
    return text;
  }
};

export default function SynopsisEtTaxonomie({ game }: { game?: Game }) {
  const [translatedSynopsis, setTranslatedSynopsis] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  useEffect(() => {
    const translateSynopsis = async () => {
      if (game?.summary) {
        setIsTranslating(true);
        const originalText = game.summary || "";
        const translated = await translateText(originalText);
        setTranslatedSynopsis(translated);
        setIsTranslating(false);
        // Si la traduction a échoué à cause du quota, planifier l'affichage du texte original
        if (translated === "Trop de requêtes de traduction. Veuillez réessayer plus tard.") {
          setShowOriginal(false);
          setTimeout(() => setShowOriginal(true), 3000);
        } else {
          setShowOriginal(false);
        }
      }
    };

    translateSynopsis();
  }, [game?.summary]);

  if (!game) return null;
  
  // Formater les plateformes
  const formattedPlatforms = game.platforms?.map(formatPlatformName) || [];
  
  // Déterminer le texte du synopsis à afficher
  const synopsisText = isTranslating
    ? "Chargement en cours..."
    : showOriginal && game.summary && translatedSynopsis === "Trop de requêtes de traduction. Veuillez réessayer plus tard."
      ? game.summary
      : (translatedSynopsis || game.summary || "Aucune histoire disponible.");
  
  // Détecter si le synopsis est court (moins de 50 caractères ou contient "Chargement")
  const isShortSynopsis = synopsisText.length < 50 || synopsisText.includes("Chargement") || synopsisText.includes("Traduction");
  
  return (
    <section className={`synopsis-taxonomie ${isShortSynopsis ? 'synopsis-taxonomie--short' : ''}`}>
      <h2 className="synopsis-taxonomie__title">SYNOPSIS</h2>
      <p className="synopsis-taxonomie__text">
        {synopsisText}
      </p>
      
      <h3 className="synopsis-taxonomie__title">PLATEFORMES</h3>
      <p className="synopsis-taxonomie__text">{formattedPlatforms.join(", ") || "-"}</p>
      {game.genres && game.genres.length > 0 && (
        <div className="genres-list">
          {game.genres.map((genre, idx) => (
            <span key={idx} className="genre-badge">
              {genre}
            </span>
          ))}
        </div>
      )}
    </section>
  );
} 