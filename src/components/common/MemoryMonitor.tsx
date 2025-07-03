'use client';

import { useEffect, useState } from 'react';

export default function MemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    // Seulement en développement
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
        });
      }
    };

    // Mettre à jour toutes les 5 secondes
    const interval = setInterval(updateMemoryInfo, 5000);
    updateMemoryInfo(); // Première mise à jour

    return () => clearInterval(interval);
  }, []);

  // Seulement afficher en développement
  if (process.env.NODE_ENV !== 'development' || !memoryInfo) {
    return null;
  }

  const usagePercentage = (memoryInfo.used / memoryInfo.limit) * 100;
  const isHighUsage = usagePercentage > 80;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: isHighUsage ? '#ff4444' : '#44ff44',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        opacity: 0.8,
      }}
    >
      <div>Mémoire: {memoryInfo.used}MB / {memoryInfo.limit}MB</div>
      <div>Usage: {usagePercentage.toFixed(1)}%</div>
      {isHighUsage && <div style={{ color: '#ffff00' }}>⚠️ Usage élevé</div>}
    </div>
  );
} 