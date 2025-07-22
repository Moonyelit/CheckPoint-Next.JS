import Image from "next/image";
import "./FollowTrophy.scss";

const FollowTrophy = () => {
  return (
    <section className="followTrophy" aria-label="Section des défis et trophées">
      <div className="TitleStyle">
        <div className="shapeLeft">
          <h2 className="Title2-Karantina titleTrophy">
            Relève des défis et prouve ta valeur !
          </h2>
        </div>
        <div className="shapeRight" aria-hidden="true">
          <div className="stripe stripe1"></div>
          <div className="stripe stripe2"></div>
        </div>
      </div>

      <div className="followTrophy-container main-container">
        <div className="trophyInfos Paragraphe1">

          <div className="trophyParagraph">
            <p>
              Crée tes propres défis et partage-les avec la communauté. Affronte
              d&apos;autres joueurs, teste de nouvelles façons de jouer et prouve ton
              talent.
            </p>

            <p>
              Chaque défi est une opportunité de redécouvrir tes jeux et de
              repousser tes propres records !
            </p>
          </div>

          <div className="trophyImage-container" role="img" aria-label="Trophée de défi">
            <Image
              src="/images/NoLogin/Trophy.png"
              alt="Trophée de défi - Symbole de réussite et de challenge"
              width={800}
              height={650}
              className="trophyImage"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FollowTrophy;
