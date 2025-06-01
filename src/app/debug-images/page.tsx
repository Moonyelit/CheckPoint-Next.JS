"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image';

interface Game {
  id: number;
  title: string;
  coverUrl: string;
  releaseDate: string;
}

export default function DebugImagesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/games/trending?limit=5');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Données reçues de l&apos;API:', data);
        setGames(data);
      } catch (err) {
        console.error('Erreur lors du fetch:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Chargement...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Erreur: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug des Images des Jeux</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Nombre de jeux récupérés:</strong> {games.length}</p>
      </div>

      {games.map((game) => (
        <div key={game.id} style={{ 
          border: '1px solid #ccc', 
          padding: '20px', 
          marginBottom: '20px',
          borderRadius: '8px'
        }}>
          <h2>{game.title}</h2>
          <p><strong>ID:</strong> {game.id}</p>
          <p><strong>Date de sortie:</strong> {game.releaseDate}</p>
          <p><strong>URL de l&apos;image:</strong></p>
          <code style={{ 
            background: '#f0f0f0', 
            padding: '5px', 
            borderRadius: '3px',
            wordBreak: 'break-all'
          }}>
            {game.coverUrl}
          </code>
          
          <div style={{ marginTop: '15px' }}>
            <h3>Test de l&apos;image avec Next.js Image:</h3>
            {game.coverUrl ? (
              <div style={{ border: '2px solid green', padding: '10px', display: 'inline-block' }}>
                <Image
                  src={game.coverUrl}
                  alt={game.title}
                  width={200}
                  height={300}
                  style={{ objectFit: 'cover' }}
                  onLoad={() => console.log(`✅ Image chargée: ${game.title}`)}
                  onError={(e) => {
                    console.error(`❌ Erreur image: ${game.title}`, e);
                  }}
                />
              </div>
            ) : (
              <p style={{ color: 'red' }}>❌ Pas d&apos;URL d&apos;image</p>
            )}
          </div>

          <div style={{ marginTop: '15px' }}>
            <h3>Test avec balise img standard:</h3>
            {game.coverUrl ? (
              <div style={{ border: '2px solid blue', padding: '10px', display: 'inline-block' }}>
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  width={200}
                  height={300}
                  style={{ objectFit: 'cover' }}
                  onLoad={() => console.log(`✅ IMG standard chargée: ${game.title}`)}
                  onError={(e) => {
                    console.error(`❌ Erreur IMG standard: ${game.title}`, e);
                  }}
                />
              </div>
            ) : (
              <p style={{ color: 'red' }}>❌ Pas d&apos;URL d&apos;image</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 