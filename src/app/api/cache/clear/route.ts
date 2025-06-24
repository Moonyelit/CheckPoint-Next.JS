import { NextRequest, NextResponse } from 'next/server';
import { GameCache } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    await GameCache.clear();
    
    return NextResponse.json(
      { message: 'Cache vidé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors du vidage du cache:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors du vidage du cache' },
      { status: 500 }
    );
  }
} 