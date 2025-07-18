import { getGameBySlug, searchAndImportGame } from "@/lib/simpleGameApi";
import "./game.scss";
import GameHeader from "./components/GameHeader";
import GameContenu from "./components/undercomposent/FICHE/undercomposent/GameContenu";
import StyleEnforcer from "./components/StyleEnforcer";
import { notFound } from "next/navigation";
import { Game } from "@/types/game";

// Fonction pour générer plusieurs variantes du titre à partir du slug
function generateTitleVariants(slug: string): string[] {
  const variants: string[] = [];
  
  // 1. Conversion basique (remplace les tirets par des espaces et capitalise)
  const basicTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  variants.push(basicTitle);
  
  // 2. Version avec chiffres romains pour les séries
  const romanNumerals = {
    'i': 'I', 'ii': 'II', 'iii': 'III', 'iv': 'IV', 'v': 'V',
    'vi': 'VI', 'vii': 'VII', 'viii': 'VIII', 'ix': 'IX', 'x': 'X'
  };
  
  let romanTitle = basicTitle;
  Object.entries(romanNumerals).forEach(([arabic, roman]) => {
    const regex = new RegExp(`${arabic}`, 'g');
    romanTitle = romanTitle.replace(regex, roman);
  });
  
  variants.push(romanTitle);
  
  return variants;
}

async function getGameData(slug: string): Promise<Game> {
  console.log(`🔍 Recherche du jeu avec le slug: ${slug}`)
  
  // 1. Essayer de récupérer le jeu directement
  const game = await getGameBySlug(slug);
  if (game) {
    console.log(`✅ Jeu trouvé directement: ${game.title}`)
    return game;
  }

  console.log(`❌ Jeu non trouvé directement, tentative d'import depuis IGDB`)

  // 2. Si le jeu n'est pas trouvé, essayer l'import depuis IGDB avec plusieurs variantes
  const titleVariants = generateTitleVariants(slug);
  console.log(`🔄 Tentative d'import avec les variantes:`, titleVariants)
  
  for (const titleVariant of titleVariants) {
    console.log(`🔍 Test de la variante: '${titleVariant}'`)
    const importedGame = await searchAndImportGame(titleVariant);
    if (importedGame) {
      console.log(`✅ Jeu importé avec succès: '${importedGame.title}'`)
      
      // Si le jeu importé n'a pas d'id (non persisté), on refait un fetch par slug pour garantir la persistance
      if (!importedGame.id && importedGame.slug) {
        console.log(`🔄 Vérification de la persistance avec le slug: ${importedGame.slug}`)
        const persistedGame = await getGameBySlug(importedGame.slug);
        if (persistedGame) {
          console.log(`✅ Jeu persistant trouvé: ${persistedGame.title}`)
          return persistedGame;
        }
      }
      // Sinon, on retourne le jeu importé
      return importedGame;
    }
  }

  console.log(`❌ Aucun jeu trouvé pour le slug: ${slug}`)
  // 3. Si aucun jeu n'est trouvé, retourner 404
  notFound();
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGameData(slug);

  return (
    <div className="game-page">
      <StyleEnforcer />
      <GameHeader
        name={game.title}
        coverUrl={game.coverUrl || "/images/placeholder-cover.jpg"}
        backgroundUrl={game.backgroundUrl || game.coverUrl || "/placeholder-background.jpg"}
        firstScreenshotUrl={game.firstScreenshotUrl}
      />
      <main className="game-fiche-container main-container">
        <GameContenu game={game} />
      </main>
    </div>
  );
}