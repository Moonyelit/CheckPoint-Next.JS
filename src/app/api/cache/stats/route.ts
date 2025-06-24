import { NextRequest, NextResponse } from 'next/server';
import { GameCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const stats = await GameCache.getStats();
    
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats du cache:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des statistiques',
        redis: { connected: false },
        memory: { size: 0, entries: 0 }
      },
      { status: 500 }
    );
  }
} 