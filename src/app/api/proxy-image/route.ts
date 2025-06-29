import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL manquante' }, { status: 400 });
    }

    // URL de votre API Symfony
    const symfonyApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const proxyUrl = `${symfonyApiUrl}/api/proxy/image?url=${encodeURIComponent(imageUrl)}`;

    // Faire la requête vers l'API Symfony
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Erreur proxy image: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Erreur lors du chargement de l'image: ${response.status}` },
        { status: response.status }
      );
    }

    // Récupérer le contenu de l'image
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Retourner l'image avec les bons headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache 24h
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Erreur proxy image:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 