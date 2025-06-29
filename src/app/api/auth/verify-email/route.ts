import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email et token requis' },
        { status: 400 }
      );
    }

    const result = await verifyEmailToken(email, token);

    // Ici vous devriez vérifier le token en base de données
    // Pour cet exemple, on simule une vérification réussie
    console.log(`Vérification du token pour ${email}: ${token}`);

    // Ici vous devriez :
    // 1. Vérifier que le token existe et n'est pas expiré
    // 2. Marquer l'email comme vérifié en base de données
    // 3. Supprimer le token utilisé

    // Simulation de succès - redirection vers l'inscription avec l'étape 4
    return NextResponse.redirect(
      new URL(`/inscription?verified=true&email=${encodeURIComponent(email)}`, request.url)
    );

  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return NextResponse.redirect(
      new URL('/inscription?error=verification-failed', request.url)
    );
  }
} 