"use client";

import React from 'react';
import LazyImage from '@/components/common/LazyImage';
import { getImageUrl } from '@/lib/imageUtils';

export default function TestImagesPage() {
  const testImages = [
    {
      title: "Clair Obscur: Expedition 33",
      originalUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co9gam.jpg",
      expectedProxyUrl: "http://localhost:8000/api/proxy/image?url=https://images.igdb.com/igdb/image/upload/t_cover_big/co9gam.jpg"
    },
    {
      title: "Astro Bot",
      originalUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co8hl0.jpg",
      expectedProxyUrl: "http://localhost:8000/api/proxy/image?url=https://images.igdb.com/igdb/image/upload/t_cover_big/co8hl0.jpg"
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧪 Test des Images avec Proxy IGDB</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>📋 Informations de test</h2>
        <p>Cette page teste l'affichage des images IGDB via notre proxy.</p>
        <p>API URL: <code>http://localhost:8000/api/proxy/image</code></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {testImages.map((image, index) => {
          const processedUrl = getImageUrl(image.originalUrl);
          
          return (
            <div key={index} style={{ border: '2px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3>{image.title}</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <h4>URLs :</h4>
                <p><strong>Originale :</strong> <code style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{image.originalUrl}</code></p>
                <p><strong>Transformée :</strong> <code style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{processedUrl}</code></p>
                <p><strong>Attendue :</strong> <code style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{image.expectedProxyUrl}</code></p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4>Test avec LazyImage :</h4>
                <div style={{ width: '200px', height: '300px', border: '1px solid #ddd' }}>
                  <LazyImage
                    src={image.originalUrl}
                    alt={image.title}
                    width={200}
                    height={300}
                    onLoad={() => console.log(`✅ Image chargée: ${image.title}`)}
                    onError={() => console.error(`❌ Erreur image: ${image.title}`)}
                  />
                </div>
              </div>

              <div>
                <h4>Test avec balise img standard :</h4>
                <img
                  src={processedUrl}
                  alt={image.title}
                  width={200}
                  height={300}
                  style={{ objectFit: 'cover', border: '1px solid #ddd' }}
                  onLoad={() => console.log(`✅ IMG standard chargée: ${image.title}`)}
                  onError={(e) => console.error(`❌ Erreur IMG standard: ${image.title}`, e)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>🔍 Instructions de débogage</h3>
        <p>1. Ouvrez la console du navigateur (F12)</p>
        <p>2. Vérifiez les logs de chargement d'images</p>
        <p>3. Vérifiez l'onglet Network pour voir les requêtes vers le proxy</p>
        <p>4. Si les images ne s'affichent pas, vérifiez que le serveur API est démarré sur localhost:8000</p>
      </div>
    </div>
  );
} 